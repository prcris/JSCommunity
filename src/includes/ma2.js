// v2.0.2 | 2026-09-03
// grandma2 Telnet library for Holyrics JSCommunity.
// In Holyrics, use a GrandMA2 receiver; it already uses TCP on port 30000.
// Autor: @prcris
//
//
// Exemplo de utilização:
//
// 1. Na grandMA2, habilite o acesso por Telnet/TCP.
// 2. No Holyrics, cadastre um receptor do tipo GrandMA2 apontando para o IP da
   // console. Esse modelo já utiliza TCP e a porta 30000.
// 3. Use o ID desse receptor nas chamadas abaixo.
//
// var receiverID = 'grandma2_igreja';
//
// jsc.ma2.connect(receiverID, {
    // username: 'Administrator',
    // password: 'sua_senha',
    // onLogin: function() {
        // // O endereço abaixo representa o executor 115 da página 1.
        // jsc.ma2.executorToggle(receiverID, '1.115');
//
        // // Outros exemplos:
        // jsc.ma2.executorOn(receiverID, '2.140');
        // jsc.ma2.executorAt(receiverID, '1.115', 75);
    // },
    // onError: function(error) {
        // h.log('jsc.ma2', '{%t} {}', h.i18n('grandMA2 communication error: {}', [error]));
    // }
// });
//
// // Encerre explicitamente a conexão quando ela não for mais necessária.
// // jsc.ma2.disconnect(receiverID);
//
//
// Estratégia de estado / reidratação:
// - O socket TCP é criado sem cacheID: conn.client = h.tcp(receiverID, { ... }).
//   Dessa forma, h.tcp(receiverID) sempre devolve o mesmo TCPClient já existente.
// - _connections[receiverID] guarda o estado auxiliar por receiver (callbacks, flags, ids de timers).
// - O estado de login é persistido no próprio TCPClient via client.put/client.get('isLoggedIn').

// =============================================================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// =============================================================================

// IMPORTANTE (Holyrics jslib):
// O código JavaScript é recarregado quando o arquivo é alterado, mas timers e
// outros objetos internos podem permanecer. Variáveis simples como "var x = {}"
// não são realmente persistentes entre recargas. Para ter estado global e
// persistente, precisamos armazenar em h.global (equivalente a setGlobal/getGlobal).

// As conexões são mantidas diretamente em h.global.grandma2_connections.

// Configurações públicas da biblioteca (acessíveis via config)
var _ma2_cfg = {
    // Credenciais padrão (podem ser sobrescritas por conexão)
    defaultUsername: 'Administrator',
    defaultPassword: 'admin',
    
    // Ping obrigatório e monitoramento de conexão. O intervalo de 1000 ms fica
    // abaixo do timeout padrão de 2 s do Holyrics e não é configurável.
    pingIntervalMs: 1000,
    pingCommand: 'Test',
    waitForWelcomeTimeoutMs: 2000, // Timeout para aguardar mensagem de boas-vindas
    
    // Logs
    logEnabled: true // Habilita/desabilita logs da biblioteca
};

// Translates runtime messages through the Holyrics i18n catalog.
function __ma2I18n(message, values) {
    var text = String(message == null ? '' : message);
    try {
        var translated = h.i18n(text);
        if (translated != null) text = String(translated);
    } catch (e) {}
    values = values || [];
    for (var i = 0; i < values.length; i++) {
        text = text.replace('{}', String(values[i]));
    }
    return text;
}

// Keeps the timestamp outside the translation key and translates log text too.
function __ma2Log(message, values) {
    h.log('jsc.ma2', '{%t} {}', jsc.ma2.__ma2I18n(message, values));
}

// =============================================================================
// CREDENCIAIS POR RECEIVER (PERSISTENTES)
// =============================================================================

// Armazena credenciais de login bem-sucedidas por receiverID usando h.store/h.restore.
// Chave de armazenamento: 'grandma2_credentials_<receiverID>' (normalizado).
function loadStoredCredentials(receiverID) {
    try {
        var key = 'grandma2_credentials_' + receiverID;
        var data = h.restore(key);
        if (data && typeof data.username === 'string' && typeof data.password === 'string') {
            return data;
        }
    } catch (e) {
        jsc.ma2.__ma2Log("Failed to \\u006Coad saved credentials for receiver {}: {}", [receiverID, e]);
    }
    return null;
}

function saveCredentials(receiverID, username, password) {
    try {
        var key = 'grandma2_credentials_' + receiverID;
        h.store(key, { username: username, password: password });
        jsc.ma2.__ma2Log('Credentials saved for receiver {}.', [receiverID]);
    } catch (e) {
        jsc.ma2.__ma2Log('Failed to save credentials for receiver {}: {}', [receiverID, e]);
    }
}

// =============================================================================
// FUNÇÕES AUXILIARES (ESTADO LOCAL / CLIENT.PROPERTIES)
// =============================================================================

// =============================================================================
// ESTRUTURA DE CONEXÃO
// =============================================================================

//
 // Estrutura que representa uma conexão ativa com grandma2
 // @typedef {Object} grandma2Connection
 // @property {string} receiverID - ID do receptor TCP configurado no Holyrics
 // @property {Object} client - Cliente TCP h.tcp()
 // @property {boolean} isLoggedIn - Estado do login
 // @property {boolean} waitingForWelcome - Aguardando mensagem de boas-vindas
 // @property {string} maintenanceIntervalId - ID do intervalo de manutenção (ping + detector)
 // @property {boolean} pingPending - Flag de ping pendente
 // @property {string} connectionCheckTimerId - ID do timer de verificação de conexão
 // @property {Function} onMessage - Callback para mensagens recebidas
 // @property {Function} onConnected - Callback quando conectado
 // @property {Function} onDisconnected - Callback quando desconectado
 // @property {Function} onLogin - Callback quando login realizado
 // @property {Function} onError - Callback para erros
 //

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

//
 // Normaliza o receiverID para string
 // Aceita tanto string quanto objeto com propriedade 'id'
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 // @returns {string} ID normalizado
 //
function normalizeReceiverID(receiverID) {
    // Sempre resolve via h.getReceiverInfo(receiverID) e retorna o id
    try {
        var info = h.getReceiverInfo(receiverID);
        if (info && info.id) return info.id;
    } catch (e) {
        jsc.ma2.__ma2Log('Could not resolve receiver information for "{}": {}', [receiverID, e]);
    }
    // Fallback
    return (typeof receiverID === 'object' && receiverID && receiverID.id) ? receiverID.id : receiverID;
}

//
 // Remove códigos ANSI/VT100 (cores e controles de terminal) do texto recebido
 // @param {string} str - String com códigos ANSI
 // @returns {string} String limpa
 //
function sanitizeAnsi(str) {
    try {
        var ESC = '\x1B';
        var re = new RegExp(ESC + '\\[[0-9;]*[A-Za-z]', 'g');
        var cleaned = str.replace(re, '');
        // Remove caracteres não imprimíveis (exceto \r\n\t)
        cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
        return cleaned;
    } catch (e) {
        return str;
    }
}

//
 // Verifica se a linha é um prompt do tipo [Fixture]>
 // @param {string} str - Linha a verificar
 // @returns {boolean}
 //
function isPromptLine(str) {
    if (!str || str.length === 0) return false;
    return /^\[.*?\]>/.test(str.trim());
}

//
 // Obtém ou cria uma estrutura de conexão
 // @param {string} receiverID - ID do receptor
 // @returns {grandma2Connection}
 //
function getConnection(receiverID) {
    if (h.global.grandma2_connections == null) {
        h.global.grandma2_connections = {};
    }
    if (!h.global.grandma2_connections[receiverID]) {
        h.global.grandma2_connections[receiverID] = {
            receiverID: receiverID,
            client: null,
            isLoggedIn: false,
            waitingForWelcome: false,
            awaitingUserCredentials: false,
            maintenanceIntervalId: null,
            pingPending: false,
            onMessage: null,
            onConnected: null,
            onDisconnected: null,
            onLogin: null,
            onError: null
        };
    }
    
    var conn = h.global.grandma2_connections[receiverID];
    
    return conn;
}

// =============================================================================
// GERENCIAMENTO DE CONEXÃO
// =============================================================================

//
 // Conecta ao grandma2 via TCP/Telnet
 // @param {string|Object} receiverID - ID do receptor TCP configurado no Holyrics (string ou objeto com .id)
 // @param {Object} options - Opções de conexão (username, password, callbacks)
 // @returns {boolean} true se conectado com sucesso
 //
function connect(receiverID, options) {
    // Normalizar receiverID (string ou objeto com .id) ANTES de consultar infos
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    jsc.err.safeNullOrEmpty(receiverID, 'receiverID');
       
    var conn = jsc.ma2.getConnection(receiverID);
    options = options || {};
    
    // Já conectado e logado? (reidratação de socket/estado já acontece em isConnected/isLoggedIn)
    if (jsc.ma2.isConnected(receiverID) && jsc.ma2.isLoggedIn(receiverID)) {
        jsc.ma2.__ma2Log('Already connected and logged in to grandma2 (receiver: {}).', [receiverID]);
        return true;
    }
    

    // Conexão não existe, limpar estado anterior se houver
    if (conn.client && !conn.client.isOpen()) {
        jsc.ma2.__ma2Log('Previous connection is closed; clearing it (receiver: {}).', [receiverID]);
        jsc.ma2.disconnect(receiverID);
    }
    
    // Configurar callbacks
    if (options.onMessage) conn.onMessage = options.onMessage;
    if (options.onConnected) conn.onConnected = options.onConnected;
    if (options.onDisconnected) conn.onDisconnected = options.onDisconnected;
    if (options.onLogin) conn.onLogin = options.onLogin;
    if (options.onError) conn.onError = options.onError;
    
    // Credenciais: tentativa em 3 camadas
    // 1) options.username/password (passadas explicitamente)
    // 2) credenciais salvas para este receiverID (h.store)
    // 3) defaults globais (Administrator/admin)
    var storedCreds = jsc.ma2.loadStoredCredentials(receiverID) || {};
    var username = options.username || storedCreds.username || jsc.ma2._ma2_cfg.defaultUsername;
    var password = options.password || storedCreds.password || jsc.ma2._ma2_cfg.defaultPassword;
    
    jsc.ma2.__ma2Log('Connecting to grandma2 (receiver: {})...', [receiverID]);
    
    try {
        // Criar conexão TCP
        conn.client = h.tcp(receiverID , {
            on_message: function(msg) {
                var rawResponse = msg.readString();
                var response = jsc.ma2.sanitizeAnsi(rawResponse);
                var out = response.trim();
                
                if (out.length === 0) return;

                // Aguardando mensagem de boas-vindas?
                if (conn.waitingForWelcome) {
                    jsc.ma2.__ma2Log('Message received while waiting for the welcome prompt: {}', [out]);
                    
                    // Verifica se recebeu "please login !" (case insensitive)
                    if (out.toLowerCase().indexOf('please login') >= 0) {
                        jsc.ma2.__ma2Log('Welcome prompt received. Sending login...');
                        conn.waitingForWelcome = false;
                        
                        // Enviar login com as credenciais atuais
                        try {
                            var loginCmd = 'Login ' + username + ' ' + password;
                            jsc.ma2.__ma2Log('Sending login command for user "{}".', [username]);
                            conn.client.send(loginCmd + '\r\n');
                        } catch (e) {
                            jsc.ma2.__ma2Log('Failed to send login: {}', [e]);
                            if (conn.onError) conn.onError(e);
                        }
                    }
                    return;
                }
                
                // Ignorar respostas do ping interno
                if (conn.pingPending) {
                    if (out.indexOf('Executing :') >= 0 && out.indexOf(jsc.ma2._ma2_cfg.pingCommand) >= 0) {
                        return;
                    }
                    if (jsc.ma2.isPromptLine(out)) {
                        conn.pingPending = false;
                        return;
                    }
                }
                
                // Callback de mensagem do usuário
                if (conn.onMessage) {
                    conn.onMessage(out, response, rawResponse);
                }

                // ============================================================
                // LOGIN: SUCESSO E ERRO
                // ============================================================

                // Login bem-sucedido?
                if (response.indexOf('Logged in as') >= 0 || out.indexOf('Logged in as') >= 0) {
                    jsc.ma2.__ma2Log('Login completed successfully (receiver: {}).', [receiverID]);
                    conn.isLoggedIn = true;
                    // Marcar no próprio TCPClient que o login foi feito
                    if (conn.client && conn.client.put) {
                        conn.client.put('isLoggedIn', true);
                    }

                    // Persistir credenciais usadas com sucesso para este receiverID.
                    // OBS: o fluxo de erro de login também chama saveCredentials
                    // com as últimas credenciais digitadas, para que fiquem
                    // pré-preenchidas na próxima tentativa.
                    jsc.ma2.saveCredentials(receiverID, username, password);
                    
                    // Inicia o loop obrigatório de ping e detecção de queda.
                    if (conn.maintenanceIntervalId == null) {
                        jsc.ma2.startMaintenanceLoop(receiverID);
                    }
                    
                    if (conn.onLogin) conn.onLogin();
                    if (conn.onConnected) conn.onConnected();
                    return;
                }

                // Login falhou?
                // Exemplos:
                //  [Fixture]>Login usuarioqualquer senherrada
                //  Executing : Login usuarioqualquer senherrada
                //  Error : Login usuarioqualquer senherrada
                if (out.indexOf('Error : Login') >= 0 || response.indexOf('Error : Login') >= 0) {
                    jsc.ma2.__ma2Log('Login failed for user "{}" (receiver: {}).', [username, receiverID]);

                    conn.isLoggedIn = false;
                    if (conn.client && conn.client.put) {
                        conn.client.put('isLoggedIn', false);
                    }

                    // Sinaliza para o ensureConnected/fluxo externo que estamos aguardando
                    // o usuário digitar novas credenciais. Enquanto esta flag estiver true,
                    // avoid loops de reconexão automáticos.
                    conn.awaitingUserCredentials = true;

                    // Antes de abrir o diálogo, salvar as credenciais atuais
                    // (mesmo que erradas) para que fiquem disponíveis como
                    // sugestão nas próximas execuções.
                    jsc.ma2.saveCredentials(receiverID, username, password);

                    // Montar parâmetros para h.input para pedir novas credenciais
                    var params = [];
                    params.push(
                        {
                            type: 'title',
                            label: h.i18n('grandMA2 login failed')
                        },
                        {
                            type: 'separator'
                        }
                    );

                    params.push(
                        {
                            key: 'username',
                            type: 'string',
                            label: h.i18n('Username'),
                            description: h.i18n('Enter a valid console username.'),
                            default_value: username || ''
                        }
                    );

                    params.push(
                        {
                            key: 'password',
                            type: 'string',
                            component: 'password',
                            label: h.i18n('Password'),
                            description: h.i18n('Enter the corresponding password.'),
                            default_value: password || ''
                        }
                    );

                    var input = null;
                    try {
                        input = h.input(params, true);
                    } catch (eDlg) {
                        jsc.ma2.__ma2Log('Failed to open the credentials dialog: {}', [eDlg]);
                    }

                    if (input == null) {
                        jsc.ma2.__ma2Log('The user cancelled the credentials dialog (receiver: {}).', [receiverID]);
                        conn.awaitingUserCredentials = false;
                        return;
                    }

                    var newUser = input.username;
                    var newPass = input.password;

                    if (!newUser || !newPass) {
                        jsc.ma2.__ma2Log('Username or password was left empty in the credentials dialog (receiver: {}).', [receiverID]);
                        conn.awaitingUserCredentials = false;
                        return;
                    }

                    // Atualiza as credenciais em uso para que o handler de sucesso
                    // ("Logged in as") também salve estes valores corretos.
                    username = newUser;
                    password = newPass;

                    jsc.ma2.__ma2Log('Resending login with the credentials supplied by the user (receiver: {}).', [receiverID]);

                    try {
                        var newLoginCmd = 'Login ' + newUser + ' ' + newPass;
                        jsc.ma2.__ma2Log('Sending login command for user "{}".', [newUser]);
                        if (conn.client && conn.client.isOpen && conn.client.isOpen()) {
                            conn.client.send(newLoginCmd + '\r\n');
                        } else {
                            jsc.ma2.__ma2Log('The socket was closed while resending login credentials (receiver: {}).', [receiverID]);
                        }
                        // IMPORTANTE: não salvamos aqui; saveCredentials será chamado
                        // quando a resposta "Logged in as" for recebida com sucesso.
                    } catch (eSend) {
                        jsc.ma2.__ma2Log('Failed to resend login credentials: {}', [eSend]);
                        if (conn.onError) {
                            conn.onError(jsc.ma2.__ma2I18n('Failed to resend login credentials: {}', [eSend]));
                        }
                    } finally {
                        // Termina o estado de espera por credenciais, independente do resultado
                        conn.awaitingUserCredentials = false;
                    }

                    return;
                }
            }
        });
        
        jsc.ma2.__ma2Log('TCP connection established. Waiting for the welcome prompt...');
        conn.waitingForWelcome = true;
        
        // Timeout de fallback: se não receber welcome em 2s, envia login mesmo assim
        h.setTimeout(function() {
            if (conn.waitingForWelcome && conn.client && conn.client.isOpen()) {
                jsc.ma2.__ma2Log('Timed out while waiting for the welcome prompt. Sending login anyway...');
                conn.waitingForWelcome = false;
                
                try {
                    var loginCmd = 'Login ' + username + ' ' + password;
                    jsc.ma2.__ma2Log('Sending login command for user "{}".', [username]);
                    conn.client.send(loginCmd + '\r\n');
                } catch (e) {
                    jsc.ma2.__ma2Log('Failed to send login after the welcome timeout: {}', [e]);
                    if (conn.onError) conn.onError(e);
                    jsc.ma2.disconnect(receiverID);
                }
            }
        }, jsc.ma2._ma2_cfg.waitForWelcomeTimeoutMs);
        
        return true;
        
    } catch (e) {
        jsc.ma2.__ma2Log('Failed to connect: {}', [e]);
        if (conn.onError) conn.onError(e);
        throw e;
    }
}

//
 // Desconecta do grandma2
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 //
function disconnect(receiverID) {
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    var conn = jsc.ma2.getConnection(receiverID);
    
    jsc.ma2.__ma2Log('Disconnecting from grandma2 (receiver: {})...', [receiverID]);
    
    try {
        // 1. PRIMEIRO: Fechar conexão TCP (se existir) - envia FIN gracefully
        if (conn.client) {
            if (conn.client.isOpen()) {
                conn.client.close();
                jsc.ma2.__ma2Log('TCP connection closed.');
            } else {
                jsc.ma2.__ma2Log('The TCP connection was already closed.');
            }
        } else {
            jsc.ma2.__ma2Log('No active TCP connection was found.');
        }
        
    // 2. DEPOIS: Parar o loop de manutenção (ping/detector não são mais necessários)
    jsc.ma2.stopMaintenanceLoop(receiverID);
        
        // 3. FINALMENTE: Limpar estado de login no client (se existir)
        if (conn.client && conn.client.put) {
            conn.client.put('isLoggedIn', false);
        }

        jsc.ma2.__ma2Log('Disconnected from grandma2 (receiver: {}).', [receiverID]);
    } catch (e) {
        jsc.ma2.__ma2Log('Failed to disconnect: {}', [e]);
    }
    
    conn.client = null;
    conn.isLoggedIn = false;
    conn.waitingForWelcome = false;
    
    if (conn.onDisconnected) conn.onDisconnected();
}

//
 // Verifica se está conectado
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 // @returns {boolean}
 //
function isConnected(receiverID) {
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    var conn = jsc.ma2.getConnection(receiverID);
    
    // A partir daqui tentamos reidratar uma conexão existente via h.tcp(receiverID),
    // pois a conexão foi criada sem cacheID: conn.client = h.tcp(receiverID, { ... }).
    // Se houver um socket ativo, h.tcp(receiverID) devolve o mesmo client.

    // Se já temos client armazenado e aberto, estamos conectados
    if (conn.client && conn.client.isOpen()) {
        return true;
    }

    // Tentar reidratar a partir do Holyrics (pode ter sido criada em outra execução)
    try {
        var existing = h.tcp(receiverID);
        if (existing && existing.isOpen && existing.isOpen()) {
            conn.client = existing;
            return true;
        }
    } catch (e) {
        jsc.ma2.__ma2Log('Could not restore the TCP connection for receiver "{}": {}', [receiverID, e]);
    }

    return false;
}

//
 // Verifica se está logado
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 // @returns {boolean}
 //
function isLoggedIn(receiverID) {
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    var conn = jsc.ma2.getConnection(receiverID);
    // Fonte de verdade principal: propriedade do TCPClient, persistida via put/get
    if (conn.client && conn.client.get) {
        var flag = conn.client.get('isLoggedIn', null);
        if (flag === true) {
            conn.isLoggedIn = true; // manter espelho local coerente
            return true;
        }
        if (flag === false) {
            conn.isLoggedIn = false;
        }
    }

    return conn.isLoggedIn === true;
}

//
 // Garante que está conectado e logado, conectando automaticamente se necessário
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 // @param {Object} options - Opções de conexão (username, password)
 // @returns {boolean}
 //
function ensureConnected(receiverID, options) {
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    var conn = jsc.ma2.getConnection(receiverID);

    // Se estamos aguardando o usuário digitar novas credenciais via h.input,
    // não faz sentido tentar reconectar em loop aqui. Apenas espera o fluxo
    // de login se resolver.
    if (conn.awaitingUserCredentials) {
        jsc.ma2.__ma2Log('Waiting for new user credentials; reconnection was not attempted (receiver: {}).', [receiverID]);
    }
    // Se já há socket aberto e estado de login, estamos prontos
    if (jsc.ma2.isConnected(receiverID) && jsc.ma2.isLoggedIn(receiverID)) {
        jsc.ma2.__ma2Log('Already connected and logged in (receiver: {}).', [receiverID]);
        return true;
    }
    
    jsc.ma2.__ma2Log('Not connected or logged in. Attempting to connect (receiver: {})...', [receiverID]);
    
    // Conectar e aguardar socket aberto + login
    jsc.ma2.connect(receiverID, options);
    
    var timerID = h.uuid();
    var timeoutMs = 4000;
    while (!(jsc.ma2.isConnected(receiverID) && jsc.ma2.isLoggedIn(receiverID)) && h.getTimerMillis(timerID) < timeoutMs) {
        h.sleep(100);
    }
    
    var success = jsc.ma2.isConnected(receiverID) && jsc.ma2.isLoggedIn(receiverID);
    if (!success && !conn.awaitingUserCredentials) {
        // Tentar uma segunda chance limpa apenas se não estivermos num
        // fluxo de re-login manual com diálogo de credenciais.
        jsc.ma2.disconnect(receiverID);
        h.sleep(300);
        jsc.ma2.connect(receiverID, options);
        var timerID2 = h.uuid();
        while (!(jsc.ma2.isConnected(receiverID) && jsc.ma2.isLoggedIn(receiverID)) && h.getTimerMillis(timerID2) < timeoutMs) {
            h.sleep(100);
        }
        success = jsc.ma2.isConnected(receiverID) && jsc.ma2.isLoggedIn(receiverID);
    }
    jsc.ma2.__ma2Log(success ? 'Connected and logged in successfully.' : 'Failed to connect or log in.');
    return success;
}

// =============================================================================
// LOOP ÚNICO DE MANUTENÇÃO (PING + DETECÇÃO DE QUEDA)
// =============================================================================

//
 // Inicia o loop de manutenção para um receiverID.
 // A cada 1000 ms ele:
 // - verifica se o socket foi fechado e, se sim, marca client.put('closed', true);
 // - envia o ping obrigatório enquanto estiver conectado e logado.
 // @param {string} receiverID - ID do receptor
 //
function startMaintenanceLoop(receiverID) {
    var conn = jsc.ma2.getConnection(receiverID);

    // Já existe um loop rodando para este receiver?
    if (conn.maintenanceIntervalId != null) {
        jsc.ma2.__ma2Log('The maintenance loop is already running (ID: {}).', [conn.maintenanceIntervalId]);
        return;
    }

    jsc.ma2.__ma2Log('Starting the maintenance loop (ping and connection monitor) every {} ms.', [jsc.ma2._ma2_cfg.pingIntervalMs]);

    conn.maintenanceIntervalId = h.setInterval(function() {
        // 1) DETECÇÃO DE QUEDA: se há client e ele foi fechado, faz a limpeza
        //    diretamente aqui (sem depender de on_property_change).
        if (conn.client && !conn.client.isOpen()) {
            jsc.ma2.__ma2Log('Connection lost. Clearing internal state (receiver: {}).', [receiverID]);

            // Parar loop de manutenção
            jsc.ma2.stopMaintenanceLoop(receiverID);

            var wasLoggedIn = conn.isLoggedIn;

            // Limpar estado local
            conn.client = null;
            conn.isLoggedIn = false;
            conn.waitingForWelcome = false;

            // Callback de desconexão para o chamador
            if (conn.onDisconnected) conn.onDisconnected();

            if (wasLoggedIn) {
                h.notification(jsc.ma2.__ma2I18n('The grandma2 connection closed unexpectedly (receiver: {}).', [receiverID]), 5);
            }

            return;
        }

        // 2) PING OBRIGATÓRIO: manter o socket vivo enquanto conectado e logado.
        if (conn.client && conn.client.isOpen() && conn.isLoggedIn) {
            try {
                conn.pingPending = true;
                conn.client.send(jsc.ma2._ma2_cfg.pingCommand + '\r\n');
            } catch (e) {
                jsc.ma2.__ma2Log('Failed to send the connection ping: {}', [e]);
                conn.pingPending = false;
            }
        }
    }, jsc.ma2._ma2_cfg.pingIntervalMs);

    if (!conn.maintenanceIntervalId) {
        jsc.ma2.__ma2Log('Could not start the maintenance loop: setInterval returned null or undefined.');
        return;
    }

    jsc.ma2.__ma2Log('Maintenance loop started (ID: {}).', [conn.maintenanceIntervalId]);
}

//
 // Para o loop de manutenção e limpa flags auxiliares.
 // @param {string} receiverID - ID do receptor
 //
function stopMaintenanceLoop(receiverID) {
    var conn = jsc.ma2.getConnection(receiverID);

    if (conn.maintenanceIntervalId != null) {
        jsc.ma2.__ma2Log('Stopping the maintenance loop (ID: {}).', [conn.maintenanceIntervalId]);
        try {
            h.clearInterval(conn.maintenanceIntervalId);
            jsc.ma2.__ma2Log('Maintenance loop stopped successfully.');
        } catch (e) {
            jsc.ma2.__ma2Log('Failed to stop the maintenance loop: {}', [e]);
        }
        conn.maintenanceIntervalId = null;
    }

    conn.pingPending = false;
}

// =============================================================================
// ENVIO DE COMANDOS
// =============================================================================

//
 // Envia um comando para o grandma2
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 // @param {string} command - Comando a enviar
 // @param {Object} options - Opções (autoConnect: true para conectar automaticamente)
 // @returns {boolean} true se enviado com sucesso
 //
function sendCommand(receiverID, command, options) {
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    jsc.err.safeNullOrEmpty(receiverID, 'receiverID');
    jsc.err.safeNullOrEmpty(command, 'command');
    
    options = options || {};
    var autoConnect = options.autoConnect !== false; // padrão true
    
    // Auto-conectar se necessário
    if (autoConnect && !jsc.ma2.isLoggedIn(receiverID)) {
        jsc.ma2.__ma2Log('Automatically connecting to grandma2...');
        if (!jsc.ma2.ensureConnected(receiverID, options)) {
            throw h.i18n('Could not connect to grandma2.');
        }
    }
    
    var conn = jsc.ma2.getConnection(receiverID);

    // Garante que há um client aberto se autoConnect estiver habilitado
    if ((!conn.client || !conn.client.isOpen()) && autoConnect) {
        // Tentativa de reidratação direta via h.tcp(receiverID)
        try {
            var existing = h.tcp(receiverID);
            if (existing && existing.isOpen && existing.isOpen()) {
                conn.client = existing;
            }
        } catch (e) {
            jsc.ma2.__ma2Log('Could not restore the TCP connection before sending a command (receiver: {}): {}', [receiverID, e]);
        }

        // Se ainda não houver client aberto, usa ensureConnected para criar um novo
        if (!conn.client || !conn.client.isOpen()) {
            if (!jsc.ma2.ensureConnected(receiverID, options)) {
                throw h.i18n('Not connected. Call connect() first.');
            }
            conn = jsc.ma2.getConnection(receiverID); // reobter após possível reconexão
        }
    }

    if (!conn.client || !conn.client.isOpen()) {
        throw h.i18n('The connection is not open. Reconnect to grandma2.');
    }

    if (!conn.isLoggedIn) {
        throw h.i18n('Waiting for grandma2 login.');
    }
    
    try {
        jsc.ma2.__ma2Log('Sending command: {}', [command]);
        conn.client.send(command + '\r\n');
        jsc.ma2.__ma2Log('Command sent successfully.');
        return true;
    } catch (e) {
        jsc.ma2.__ma2Log('Failed to send command: {}', [e]);
        
        // Se a conexão foi fechada, apenas limpe a referência e
        // permita que o detector/ping cuidem da recuperação.
        if (e && e.message && e.message.indexOf('closed') >= 0) {
            jsc.ma2.__ma2Log('The socket closed while sending. Clearing its reference for automatic recovery.');
            var _conn = jsc.ma2.getConnection(receiverID);
            _conn.client = null;
        }
        
        throw e;
    }
}

// =============================================================================
// COMANDOS ESPECÍFICOS DO grandma2
// =============================================================================

//
 // Liga um executor (Fader/Button)
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorOn(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'On Executor ' + executor, options);
}

//
 // Desliga um executor
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorOff(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'Off Executor ' + executor, options);
}

//
 // Alterna um executor (toggle)
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorToggle(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'Toggle Executor ' + executor, options);
}

//
 // Flash de um executor (enquanto pressionado)
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorFlash(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'Flash Executor ' + executor, options);
}

//
 // Define o valor de um executor (0-100)
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {number} value - Valor (0-100)
 // @param {Object} options - Opções adicionais
 //
function executorAt(receiverID, executor, value, options) {
    value = jsc.utils.range(value, 0, 100);
    return jsc.ma2.sendCommand(receiverID, 'Executor ' + executor + ' At ' + value, options);
}

//
 // Executa Go em um executor (avança para próxima cue)
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorGo(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'Go Executor ' + executor, options);
}

//
 // Pausa um executor
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorPause(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'Pause Executor ' + executor, options);
}

//
 // Volta uma cue em um executor
 // @param {string} receiverID - ID do receptor
 // @param {string} executor - Executor (ex: "1.6", "2.1")
 // @param {Object} options - Opções adicionais
 //
function executorGoBack(receiverID, executor, options) {
    return jsc.ma2.sendCommand(receiverID, 'GoBack Executor ' + executor, options);
}

//
 // Seleciona fixtures
 // @param {string} receiverID - ID do receptor
 // @param {string} fixtures - Fixtures a selecionar (ex: "1", "1+2", "1 Thru 10")
 // @param {Object} options - Opções adicionais
 //
function selectFixture(receiverID, fixtures, options) {
    return jsc.ma2.sendCommand(receiverID, 'Fixture ' + fixtures, options);
}

//
 // Limpa seleção atual
 // @param {string} receiverID - ID do receptor
 // @param {Object} options - Opções adicionais
 //
function clearSelection(receiverID, options) {
    return jsc.ma2.sendCommand(receiverID, 'Clear', options);
}

//
 // Define o dimmer de fixtures selecionados (0-100)
 // @param {string} receiverID - ID do receptor
 // @param {number} value - Valor do dimmer (0-100)
 // @param {Object} options - Opções adicionais
 //
function setDimmer(receiverID, value, options) {
    value = jsc.utils.range(value, 0, 100);
    return jsc.ma2.sendCommand(receiverID, 'Dimmer At ' + value, options);
}

//
 // Define cor RGB para fixtures selecionados
 // @param {string} receiverID - ID do receptor
 // @param {number} r - Vermelho (0-255)
 // @param {number} g - Verde (0-255)
 // @param {number} b - Azul (0-255)
 // @param {Object} options - Opções adicionais
 //
function setRGB(receiverID, r, g, b, options) {
    r = jsc.utils.range(r, 0, 255);
    g = jsc.utils.range(g, 0, 255);
    b = jsc.utils.range(b, 0, 255);
    
    jsc.ma2.sendCommand(receiverID, 'ColorRGB ' + r + ' ' + g + ' ' + b, options);
}

//
 // Ativa uma cue específica
 // @param {string} receiverID - ID do receptor
 // @param {string} cue - Número da cue (ex: "1", "2.5")
 // @param {Object} options - Opções adicionais
 //
function gotoCue(receiverID, cue, options) {
    return jsc.ma2.sendCommand(receiverID, 'Goto Cue ' + cue, options);
}

//
 // Define o BPM do sistema
 // @param {string} receiverID - ID do receptor
 // @param {number} bpm - BPM desejado
 // @param {Object} options - Opções adicionais
 //
function setBPM(receiverID, bpm, options) {
    bpm = jsc.utils.range(bpm, 30, 300);
    return jsc.ma2.sendCommand(receiverID, 'Assign SpeedMaster 1 /BPM=' + bpm, options);
}

//
 // Blackout (escurece tudo)
 // @param {string} receiverID - ID do receptor
 // @param {boolean} enabled - true para ativar, false para desativar
 // @param {Object} options - Opções adicionais
 //
function setBlackout(receiverID, enabled, options) {
    return jsc.ma2.sendCommand(receiverID, enabled ? 'Blackout' : 'Blackout Off', options);
}

//
 // Ativa/desativa gran Master
 // @param {string} receiverID - ID do receptor
 // @param {number} value - Valor (0-100)
 // @param {Object} options - Opções adicionais
 //
function setgranMaster(receiverID, value, options) {
    value = jsc.utils.range(value, 0, 100);
    return jsc.ma2.sendCommand(receiverID, 'Master 1 At ' + value, options);
}

//
 // Limpa o programmer
 // @param {string} receiverID - ID do receptor
 // @param {Object} options - Opções adicionais
 //
function clearProgrammer(receiverID, options) {
    return jsc.ma2.sendCommand(receiverID, 'Clear', options);
}

//
 // Seleciona e define fixtures com dimmer em um único comando
 // @param {string} receiverID - ID do receptor
 // @param {string} fixtures - Fixtures (ex: "1", "1+2", "1 Thru 10")
 // @param {number} dimmer - Valor do dimmer (0-100)
 // @param {Object} options - Opções adicionais
 //
function fixtureAtDimmer(receiverID, fixtures, dimmer, options) {
    dimmer = jsc.utils.range(dimmer, 0, 100);
    return jsc.ma2.sendCommand(receiverID, 'Fixture ' + fixtures + ' At ' + dimmer, options);
}

//
 // Armazena a seleção atual em uma cue
 // @param {string} receiverID - ID do receptor
 // @param {string} cue - Número da cue
 // @param {Object} options - Opções adicionais
 //
function storeCue(receiverID, cue, options) {
    return jsc.ma2.sendCommand(receiverID, 'Store Cue ' + cue, options);
}

//
 // Deleta uma cue
 // @param {string} receiverID - ID do receptor
 // @param {string} cue - Número da cue
 // @param {Object} options - Opções adicionais
 //
function deleteCue(receiverID, cue, options) {
    return jsc.ma2.sendCommand(receiverID, 'Delete Cue ' + cue, options);
}

//
 // Ativa um grupo
 // @param {string} receiverID - ID do receptor
 // @param {string} group - Número do grupo
 // @param {Object} options - Opções adicionais
 //
function selectGroup(receiverID, group, options) {
    return jsc.ma2.sendCommand(receiverID, 'Group ' + group, options);
}

//
 // Ativa um preset
 // @param {string} receiverID - ID do receptor
 // @param {string} preset - ID do preset
 // @param {Object} options - Opções adicionais
 //
function selectPreset(receiverID, preset, options) {
    return jsc.ma2.sendCommand(receiverID, 'Preset ' + preset, options);
}

// =============================================================================
// CONFIGURAÇÕES GLOBAIS
// =============================================================================

//
 // Define as credenciais de login padrão
 // @param {string} username - Nome de usuário
 // @param {string} password - Senha
 //
function setDefaultCredentials(username, password) {
    jsc.ma2._ma2_cfg.defaultUsername = username;
    jsc.ma2._ma2_cfg.defaultPassword = password;
}

//
 // Habilita/desabilita logs da biblioteca
 // @param {boolean} enabled - true para habilitar
 //
function setLogEnabled(enabled) {
    jsc.ma2._ma2_cfg.logEnabled = (enabled === true);
    h.log.setEnabled('jsc.ma2', enabled === true);
}

//
 // UTILITÁRIO: Limpa todos os timers ativos de um receiverID (útil para debug)
 // @param {string|Object} receiverID - ID do receptor (string ou objeto com .id)
 //
function clearAllTimers(receiverID) {
    receiverID = jsc.ma2.normalizeReceiverID(receiverID);
    jsc.ma2.__ma2Log('Clearing all timers for receiver {}.', [receiverID]);
    
    // Parar loop de manutenção normalmente
    jsc.ma2.stopMaintenanceLoop(receiverID);
    
    jsc.ma2.__ma2Log('All timers for receiver "{}" were cleared.', [receiverID]);
}
