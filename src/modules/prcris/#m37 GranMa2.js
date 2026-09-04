// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22696e666f227d
// v2.5.1 | 2026-09-03
// Autor: @prcris
// Exemplo de utilização:
// 1. Crie no Holyrics um receptor do tipo GrandMA2 com o IP da mesa.
// 2. Selecione esse receptor nas configurações do módulo.
// 3. Cadastre um Executor com o código 145 (interpretado como 1.145) ou 2.140.
// 4. Associe o Executor a uma tag nas configurações ou use "Azul | 145".
var mID = '@prcris#m37';
var mUID = mID + '';

//#import modules_generic_functions

function info() {
    return {
        id: mID,
        name: 'grandMA2 Telnet',
        description: '<html>' +
            '<div style="text-align:left;">' +
            '<b>grandMA2 Telnet — Controle de Executors</b><br><br>' +
            'Controla a iluminação da mesa grandMA2 pelo Holyrics usando TCP/Telnet.<br><br>' +
            '<b>Configuração:</b><br>' +
            '• Na grandMA2, abra Setup → Console → Global Settings → Telnet e selecione Login Enabled.<br>' +
            '• No Holyrics, crie um receptor GrandMA2, informe o IP da mesa e selecione-o nas configurações do módulo. Esse modelo já usa TCP e a porta 30000.<br>' +
            '• Cadastre cada Executor com um nome e o código exibido no botão da grandMA2. Um código sem página, como 145, é interpretado como 1.145; para outra página, informe o valor completo, como 2.140.<br><br>' +
            '<b>Como funciona:</b><br>' +
            '• O primeiro comando abre a conexão automaticamente, faz o login e inicia um ping obrigatório a cada segundo para manter o socket ativo.<br>' +
            '• A ação pública em lote liga todos os Executors selecionados e, após o atraso configurado, desliga os que não foram selecionados.<br>' +
            '• A automação usa os gatilhos de tema e plano de fundo para identificar a abertura de músicas e apresentações automáticas. As tags do tema têm prioridade; o fundo é usado quando o tema não possui Executor associado. Ao encerrar uma música ou apresentação automática, o Executor ativo é desligado. Se houver vários Executors na mesma fonte, somente o primeiro será usado e um alerta será exibido.<br>' +
            '• O filtro opcional por evento limita a automação por tags aos eventos informados.<br>' +
            '• O botão de verificação permite conferir manualmente se as músicas da playlist possuem uma tag de iluminação válida.<br><br>' +
            '<b>Importante:</b><br>' +
            'O estado LIGADO/DESLIGADO é virtual, fica somente na memória e retorna a DESLIGADO após uma reinicialização. Esta versão é voltada aos Executors e não inclui macros nem gravação de comandos Telnet.<br><br>' +
            infoVDDMM +
            '</div>',
        min_version: '2.29.0',
        i18n: {
            name: {
                pt: 'grandMA2 Telnet',
                en: 'grandMA2 Telnet',
                es: 'grandMA2 Telnet',
                it: 'grandMA2 Telnet',
                uk: 'grandMA2 Telnet',
                ru: 'grandMA2 Telnet'
            },
            description: {
                pt: '<html>' +
                    '<div style="text-align:left;">' +
                    '<b>grandMA2 Telnet — Controle de Executors</b><br><br>' +
                    'Controla a iluminação da mesa grandMA2 pelo Holyrics usando TCP/Telnet.<br><br>' +
                    '<b>Configuração:</b><br>' +
                    '• Na grandMA2, abra Setup → Console → Global Settings → Telnet e selecione Login Enabled.<br>' +
                    '• No Holyrics, crie um receptor GrandMA2, informe o IP da mesa e selecione-o nas configurações do módulo. Esse modelo já usa TCP e a porta 30000.<br>' +
                    '• Cadastre cada Executor com um nome e o código exibido no botão da grandMA2. Um código sem página, como 145, é interpretado como 1.145; para outra página, informe o valor completo, como 2.140.<br><br>' +
                    '<b>Como funciona:</b><br>' +
                    '• O primeiro comando abre a conexão automaticamente, faz o login e inicia um ping obrigatório a cada segundo para manter o socket ativo.<br>' +
                    '• A ação pública em lote liga todos os Executors selecionados e, após o atraso configurado, desliga os que não foram selecionados.<br>' +
                    '• A automação usa os gatilhos de tema e plano de fundo para identificar a abertura de músicas e apresentações automáticas. As tags do tema têm prioridade; o fundo é usado quando o tema não possui Executor associado. Ao encerrar uma música ou apresentação automática, o Executor ativo é desligado. Se houver vários Executors na mesma fonte, somente o primeiro será usado e um alerta será exibido.<br>' +
                    '• O filtro opcional por evento limita a automação por tags aos eventos informados.<br>' +
                    '• O botão de verificação permite conferir manualmente se as músicas da playlist possuem uma tag de iluminação válida.<br><br>' +
                    '<b>Importante:</b><br>' +
                    'O estado LIGADO/DESLIGADO é virtual, fica somente na memória e retorna a DESLIGADO após uma reinicialização. Esta versão é voltada aos Executors e não inclui macros nem gravação de comandos Telnet.<br><br>' +
                    infoVDDMM +
                    '</div>',
                en: '<html>' +
                    '<div style="text-align:left;">' +
                    '<b>grandMA2 Telnet — Executor Control</b><br><br>' +
                    'Controls grandMA2 console lighting from Holyrics over TCP/Telnet.<br><br>' +
                    '<b>Setup:</b><br>' +
                    '• In grandMA2, open Setup → Console → Global Settings → Telnet and select Login Enabled.<br>' +
                    '• In Holyrics, create a GrandMA2 receiver, enter the console IP, and select it in the module settings. This receiver model already uses TCP and port 30000.<br>' +
                    '• Register each Executor with a name and the code shown on its grandMA2 button. A code without a page, such as 145, is interpreted as 1.145; for another page, enter the full value, such as 2.140.<br><br>' +
                    '<b>How it works:</b><br>' +
                    '• The first command opens the connection automatically, logs in, and starts a mandatory ping every second to keep the socket active.<br>' +
                    '• The batch public action turns on all selected Executors and, after the configured delay, turns off the unselected ones.<br>' +
                    '• Automation uses theme and background triggers to identify the opening of songs and automatic presentations. Theme tags take priority; the background is used when the theme has no associated Executor. Closing a song or automatic presentation turns off the active Executor. If the same source resolves to multiple Executors, only the first is used and an alert is displayed.<br>' +
                    '• The optional event filter limits tag automation to the specified events.<br>' +
                    '• The verification button manually checks whether playlist songs have a valid lighting tag.<br><br>' +
                    '<b>Important:</b><br>' +
                    'The ON/OFF state is virtual, is stored in memory only, and returns to OFF after a restart. This version focuses on Executors and does not include macros or Telnet command recording.<br><br>' +
                    infoVDDMM +
                    '</div>',
                es: '<html>' +
                    '<div style="text-align:left;">' +
                    '<b>grandMA2 Telnet — Control de Executors</b><br><br>' +
                    'Controla la iluminación de la consola grandMA2 desde Holyrics mediante TCP/Telnet.<br><br>' +
                    '<b>Configuración:</b><br>' +
                    '• En grandMA2, abra Setup → Console → Global Settings → Telnet y seleccione Login Enabled.<br>' +
                    '• En Holyrics, cree un receptor GrandMA2, introduzca la IP de la consola y selecciónelo en la configuración del módulo. Este modelo ya utiliza TCP y el puerto 30000.<br>' +
                    '• Registre cada Executor con un nombre y el código mostrado en su botón de grandMA2. Un código sin página, como 145, se interpreta como 1.145; para otra página, introduzca el valor completo, como 2.140.<br><br>' +
                    '<b>Cómo funciona:</b><br>' +
                    '• El primer comando abre la conexión automáticamente, inicia sesión y activa un ping obligatorio cada segundo para mantener el socket activo.<br>' +
                    '• La acción pública por lotes enciende todos los Executors seleccionados y, después del retraso configurado, apaga los no seleccionados.<br>' +
                    '• La automatización usa los disparadores de tema y fondo para identificar la apertura de canciones y presentaciones automáticas. Las etiquetas del tema tienen prioridad; el fondo se usa cuando el tema no tiene un Executor asociado. Al cerrar una canción o presentación automática, se apaga el Executor activo. Si la misma fuente apunta a varios Executors, solo se usa el primero y se muestra una alerta.<br>' +
                    '• El filtro opcional por evento limita la automatización por etiquetas a los eventos indicados.<br>' +
                    '• El botón de verificación comprueba manualmente si las canciones de la lista tienen una etiqueta de iluminación válida.<br><br>' +
                    '<b>Importante:</b><br>' +
                    'El estado ENCENDIDO/APAGADO es virtual, solo se guarda en memoria y vuelve a APAGADO después de reiniciar. Esta versión se centra en Executors y no incluye macros ni grabación de comandos Telnet.<br><br>' +
                    infoVDDMM +
                    '</div>',
                it: '<html>' +
                    '<div style="text-align:left;">' +
                    '<b>grandMA2 Telnet — Controllo degli Executor</b><br><br>' +
                    'Controlla le luci della console grandMA2 da Holyrics tramite TCP/Telnet.<br><br>' +
                    '<b>Configurazione:</b><br>' +
                    '• In grandMA2, apri Setup → Console → Global Settings → Telnet e seleziona Login Enabled.<br>' +
                    '• In Holyrics, crea un ricevitore GrandMA2, inserisci l’indirizzo IP della console e selezionalo nelle impostazioni del modulo. Questo modello usa già TCP e la porta 30000.<br>' +
                    '• Registra ogni Executor con un nome e il codice mostrato sul relativo pulsante grandMA2. Un codice senza pagina, come 145, viene interpretato come 1.145; per un’altra pagina, inserisci il valore completo, come 2.140.<br><br>' +
                    '<b>Come funziona:</b><br>' +
                    '• Il primo comando apre automaticamente la connessione, esegue l’accesso e avvia un ping obbligatorio ogni secondo per mantenere attivo il socket.<br>' +
                    '• L’azione pubblica in gruppo accende tutti gli Executor selezionati e, dopo il ritardo configurato, spegne quelli non selezionati.<br>' +
                    '• L’automazione usa i trigger di tema e sfondo per identificare l’apertura di brani e presentazioni automatiche. I tag del tema hanno la priorità; lo sfondo viene usato quando il tema non ha un Executor associato. Alla chiusura di un brano o di una presentazione automatica, l’Executor attivo viene spento. Se la stessa origine indica più Executor, viene usato solo il primo e viene mostrato un avviso.<br>' +
                    '• Il filtro evento opzionale limita l’automazione tramite tag agli eventi indicati.<br>' +
                    '• Il pulsante di verifica controlla manualmente se i brani della playlist hanno un tag luci valido.<br><br>' +
                    '<b>Importante:</b><br>' +
                    'Lo stato ACCESO/SPENTO è virtuale, viene conservato solo in memoria e torna a SPENTO dopo un riavvio. Questa versione è dedicata agli Executor e non include macro né registrazione dei comandi Telnet.<br><br>' +
                    infoVDDMM +
                    '</div>',
                uk: '<html>' +
                    '<div style="text-align:left;">' +
                    '<b>grandMA2 Telnet — Керування Executor</b><br><br>' +
                    'Керує освітленням консолі grandMA2 із Holyrics через TCP/Telnet.<br><br>' +
                    '<b>Налаштування:</b><br>' +
                    '• У grandMA2 відкрийте Setup → Console → Global Settings → Telnet і виберіть Login Enabled.<br>' +
                    '• У Holyrics створіть приймач GrandMA2, укажіть IP-адресу консолі та виберіть його в налаштуваннях модуля. Цей тип приймача вже використовує TCP і порт 30000.<br>' +
                    '• Зареєструйте кожен Executor, указавши назву та код із його кнопки в grandMA2. Код без сторінки, наприклад 145, тлумачиться як 1.145; для іншої сторінки введіть повне значення, наприклад 2.140.<br><br>' +
                    '<b>Як це працює:</b><br>' +
                    '• Перша команда автоматично відкриває з’єднання, виконує вхід і запускає обов’язковий ping щосекунди, щоб підтримувати socket активним.<br>' +
                    '• Пакетна публічна дія вмикає всі вибрані Executor, а після налаштованої затримки вимикає невибрані.<br>' +
                    '• Автоматизація використовує тригери теми та фону для визначення відкриття пісень і автоматичних презентацій. Теги теми мають пріоритет; фон використовується, якщо тема не має пов’язаного Executor. Після закриття пісні або автоматичної презентації активний Executor вимикається. Якщо одне джерело вказує на кілька Executor, використовується лише перший і відображається попередження.<br>' +
                    '• Необов’язковий фільтр подій обмежує автоматизацію за тегами вказаними подіями.<br>' +
                    '• Кнопка перевірки вручну визначає, чи мають пісні у списку дійсний тег освітлення.<br><br>' +
                    '<b>Важливо:</b><br>' +
                    'Стан УВІМКНЕНО/ВИМКНЕНО є віртуальним, зберігається лише в пам’яті та повертається до ВИМКНЕНО після перезапуску. Ця версія зосереджена на Executor і не містить макросів або запису команд Telnet.<br><br>' +
                    infoVDDMM +
                    '</div>',
                ru: '<html>' +
                    '<div style="text-align:left;">' +
                    '<b>grandMA2 Telnet — Управление Executor</b><br><br>' +
                    'Управляет освещением консоли grandMA2 из Holyrics через TCP/Telnet.<br><br>' +
                    '<b>Настройка:</b><br>' +
                    '• В grandMA2 откройте Setup → Console → Global Settings → Telnet и выберите Login Enabled.<br>' +
                    '• В Holyrics создайте приёмник GrandMA2, укажите IP-адрес консоли и выберите его в настройках модуля. Этот тип приёмника уже использует TCP и порт 30000.<br>' +
                    '• Зарегистрируйте каждый Executor, указав имя и код с его кнопки в grandMA2. Код без страницы, например 145, интерпретируется как 1.145; для другой страницы введите полное значение, например 2.140.<br><br>' +
                    '<b>Как это работает:</b><br>' +
                    '• Первая команда автоматически открывает соединение, выполняет вход и запускает обязательный ping каждую секунду, чтобы поддерживать socket активным.<br>' +
                    '• Пакетное публичное действие включает все выбранные Executor, а после настроенной задержки выключает невыбранные.<br>' +
                    '• Автоматизация использует триггеры темы и фона для определения открытия песен и автоматических презентаций. Теги темы имеют приоритет; фон используется, если у темы нет связанного Executor. При закрытии песни или автоматической презентации активный Executor выключается. Если один источник указывает на несколько Executor, используется только первый и отображается предупреждение.<br>' +
                    '• Необязательный фильтр событий ограничивает автоматизацию по тегам указанными событиями.<br>' +
                    '• Кнопка проверки вручную определяет, есть ли у песен в плейлисте корректный тег освещения.<br><br>' +
                    '<b>Важно:</b><br>' +
                    'Состояние ВКЛЮЧЕНО/ВЫКЛЮЧЕНО является виртуальным, хранится только в памяти и возвращается к ВЫКЛЮЧЕНО после перезапуска. Эта версия ориентирована на Executor и не включает макросы или запись команд Telnet.<br><br>' +
                    infoVDDMM +
                    '</div>'
            }
        }
    };
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2267656e657269635f66756e6374696f6e73227d
// v2.3.4 | 2026-09-03
// Autor: @prcris

// =========================
// Helpers internos do módulo
// =========================

// Usa o i18n oficial do Holyrics e mantém o texto-base em português quando
// ainda não houver tradução cadastrada. Assim, nenhum nome de campo fica vazio.
function _moduleI18n(text, values) {
    var translated = null;
    var result = String(text || '');
    var replacements = values || [];
    var i;

    try {
        if (typeof h !== 'undefined' && typeof h.i18n === 'function') {
            translated = h.i18n(result);
        }
    } catch (e) {
        translated = null;
    }

    if (translated !== null && typeof translated !== 'undefined' && String(translated).trim() !== '') {
        result = String(translated);
    }

    for (i = 0; i < replacements.length; i++) {
        result = result.replace('{}', String(replacements[i]));
    }
    return result;
}

// Usa o catálogo oficial do Holyrics também nas mensagens de diagnóstico.
function _moduleLog(message, values) {
    h.log(mUID, '{%t} {}', _moduleI18n(message, values || []));
}

function _buildGrandma2SendOptions(module) {
    return {
        username: 'Administrator',
        password: 'admin',

        onConnected: function() {
            _moduleLog('Conexão TCP estabelecida.');
        },

        onLogin: function() {
            _moduleLog('Login concluído com sucesso.');
            module.updatePanel();
        },

        onDisconnected: function() {
            _moduleLog('Desconectado da grandMA2.');
            module.updatePanel();
        },

        onMessage: function(cleanMessage, sanitizedMessage, rawMessage) {
            if (module.settings.filter_prompt && jsc.ma2.isPromptLine(cleanMessage)) {
                return;
            }

            if (module.settings.log) {
                _moduleLog('Recebido: {}', [cleanMessage]);
            }
        },

        onError: function(error) {
            _moduleLog('Erro: {}', [error]);
        }
    };
}

function _tryRefreshModuleActions(module, reason) {
    // Importante: já observamos duplicação de itens na barra quando tentamos
    // forçar reload de actions/publicActions em certas versões do Holyrics.
    // Aqui fazemos apenas um repaint do painel (seguro), sem mexer na lista.
    try {
        if (module && typeof module.repaintPanel === 'function') {
            module.repaintPanel();
            return true;
        }
    } catch (e) {
        // ignore
    }
    return false;
}

function _coerceBoolean(v) {
    if (v === true) return true;
    if (v === 1) return true;
    if (v === '1') return true;
    if (typeof v === 'string') {
        var s = v.trim().toLowerCase();
        if (s === 'true' || s === 'yes' || s === 'on') return true;
    }
    return false;
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a226578656375746f7273227d
// v2.4.0 | 2026-09-03
// Autor: @prcris

// =========================
// Helpers internos para Executors (estado virtual)
// =========================

function _normalizeExecutorAddressText(text) {
    text = ('' + (text || '')).trim();
    if (!text) return '';

    // Aceita colar comandos completos e extrai apenas o endereço
    // Ex.: "On Executor 1.123" → "1.123"
    text = text.replace(/^\s*(on|off|toggle)\s+executor\s+/i, '');

    // Alguns usuários colam só "Executor 1.123"
    text = text.replace(/^\s*executor\s+/i, '');

    // Na ausência da página, a grandMA2 deve usar a página 1.
    // Exemplos: "140" -> "1.140"; "2.140" permanece "2.140".
    if (/^\d+$/.test(text)) {
        text = '1.' + text;
    }

    return text.trim();
}

function _normalizeExecutorAddress(item) {
    var addr = (item && (item.address || item.endereco || item.executor || item.addr)) || '';
    return _normalizeExecutorAddressText(addr);
}

function _normalizeExecutorId(address, index) {
    address = ('' + (address || '')).trim();
    if (address) {
        // Importante: evitar '.' no ID do input (alguns contextos interpretam como path)
        return 'exec_' + address.replace(/[^a-zA-Z0-9_-]/g, '_');
    }
    return 'exec_' + (index + 1);
}

function _normalizeExecutorIdLegacy(address, index) {
    // Compat com versões anteriores que permitiam '.' no id (ex.: exec_1.121)
    address = ('' + (address || '')).trim();
    if (address) {
        return 'exec_' + address.replace(/[^a-zA-Z0-9_.-]/g, '_');
    }
    return 'exec_' + (index + 1);
}

function _getExecutorsFromSettings(module) {
    var ctrl = module.getObjectModelCtrl && module.getObjectModelCtrl('grandma2_executor');
    var list = ctrl && ctrl.getAll ? ctrl.getAll() : null;
    if (!list || !list.length) return [];

    var result = [];
    for (var i = 0; i < list.length; i++) {
        var it = list[i] || {};
        var address = _normalizeExecutorAddress(it);
        if (!address) continue;
        var name = (it.name || it.label || '').trim();
        var label = name || (_moduleI18n("Executor") + ' ' + address);
        var id = _normalizeExecutorId(address, i);

        result.push({
            id: id,
            label: label,
            name: name,
            address: address
        });
    }
    return result;
}

function _getExecutorVirtualStore(module) {
    // Estado virtual APENAS em memória (não persiste ao reiniciar o Holyrics)
    // e também sobrevive a recarregamentos do script dentro da mesma sessão.
    var root = h.global.grandma2_executor_virtual_store || {};
    h.global.grandma2_executor_virtual_store = root;

    var moduleKey = mID + '_' + (module && module.id ? module.id : '');
    if (!root[moduleKey]) root[moduleKey] = {};
    return root[moduleKey];
}

function _clearExecutorVirtualStore(module) {
    var root = h.global.grandma2_executor_virtual_store || {};
    h.global.grandma2_executor_virtual_store = root;
    var moduleKey = mID + '_' + (module && module.id ? module.id : '');
    root[moduleKey] = {};
}

function _getExecutorVirtualState(module, executor) {
    try {
        var store = _getExecutorVirtualStore(module);
        return store[executor.id] === true;
    } catch (e) {
        return false;
    }
}

function _setExecutorVirtualState(module, executor, isOn) {
    try {
        var store = _getExecutorVirtualStore(module);
        store[executor.id] = (isOn === true);
    } catch (e) {
        // ignore
    }
}

function _executorVirtualStateLabel(module, executor) {
    var on = _getExecutorVirtualState(module, executor);
    return on ? 'ON' : 'OFF';
}

function _runExecutorSet(module, executor, desiredOn) {
    var receiverID = module.settings.receiver_id;
    if (!receiverID) {
        _moduleLog('O receptor não está configurado.');
        h.notification(_moduleI18n("Configure o receptor GrandMA2 nas configurações"), 3);
        return;
    }

    try {
        var opts = _buildGrandma2SendOptions(module);
        if (desiredOn) {
            jsc.ma2.sendCommand(receiverID, 'On Executor ' + executor.address, opts);
        } else {
            jsc.ma2.sendCommand(receiverID, 'Off Executor ' + executor.address, opts);
        }

        _setExecutorVirtualState(module, executor, desiredOn);
        _moduleLog('{} Executor {} (estado virtual: {}).', [desiredOn ? 'Ligando' : 'Desligando', executor.address, desiredOn ? 'LIGADO' : 'DESLIGADO']);
        module.updatePanel();
    } catch (e) {
        _moduleLog('Erro ao enviar comando para o Executor {}: {}', [executor.address, e]);
        h.notification(_moduleI18n('Erro ao enviar comando: {}', [e]), 4);
        module.updatePanel();
    }
}

function _runExecutorToggleVirtual(module, executor) {
    var current = _getExecutorVirtualState(module, executor);
    _runExecutorSet(module, executor, !current);
}

function _getExecutorBatchRuntime(module) {
    var root = h.global.grandma2_executor_batch_runtime || {};
    h.global.grandma2_executor_batch_runtime = root;
    var moduleKey = mID + '_' + (module && module.id ? module.id : '');
    if (!root[moduleKey]) root[moduleKey] = { pendingOffTimerId: null };
    return root[moduleKey];
}

function _buildExecutorBatchInputs(module, executors) {
    // Input único: marcado = On, desmarcado = Off.
    var inputs = [];

    inputs.push({ type: 'title', name: _moduleI18n("Executors da grandMA2 (lote)") });
    inputs.push({ type: 'separator' });
    inputs.push({ type: 'title', name: _moduleI18n("Ligar — não selecionados = desligar") });

    for (var i = 0; i < executors.length; i++) {
        var e = executors[i];
        inputs.push({
            id: 'on__' + e.id,
            type: 'boolean',
            name: e.label + ' (' + e.address + ')'
        });
    }

    return inputs;
}

function _runExecutorBatch(module, selection) {
    var receiverID = module.settings.receiver_id;
    if (!receiverID) {
        _moduleLog('O receptor não está configurado.');
        h.notification(_moduleI18n("Configure o receptor GrandMA2 nas configurações"), 3);
        return;
    }

    var executors = _getExecutorsFromSettings(module);
    if (!executors.length) {
        h.notification(_moduleI18n("Cadastre pelo menos um Executor nas configurações"), 3);
        return;
    }

    var byId = {};
    for (var i = 0; i < executors.length; i++) {
        var ex = executors[i];
        byId[ex.id] = ex;

        // Se o Holyrics tiver cacheado o schema antigo do publicAction,
        // os IDs podem vir no formato legado (com '.')
        var legacyId = _normalizeExecutorIdLegacy(ex.address, i);
        byId[legacyId] = ex;
    }

    var toOn = [];
    var toOff = [];

    function _isChecked(v) {
        if (v === true) return true;
        if (v === 1) return true;
        if (v === '1') return true;
        if (typeof v === 'string') {
            var s = v.trim().toLowerCase();
            if (s === 'true' || s === 'yes' || s === 'on') return true;
        }
        return false;
    }

    // Marcado = On; desmarcado = Off (todos os executors cadastrados participam).
    selection = selection || {};
    for (var i = 0; i < executors.length; i++) {
        var ex = executors[i];
        var key = 'on__' + ex.id;
        // Tenta também o ID legado (formato antigo com '.')
        var legacyKey = 'on__' + _normalizeExecutorIdLegacy(ex.address, i);
        // Antes da normalização automática de página, "145" gerava exec_145.
        var shortPageOneAddress = ex.address.replace(/^1\./, '');
        var oldPageOneKey = 'on__' + _normalizeExecutorIdLegacy(shortPageOneAddress, i);
        var checked = _isChecked(selection[key]) ||
            _isChecked(selection[legacyKey]) ||
            _isChecked(selection[oldPageOneKey]);
        if (checked) {
            toOn.push(ex.id);
        } else {
            toOff.push(ex.id);
        }
    }

    var opts = _buildGrandma2SendOptions(module);

    // Execução em duas fases: On imediato e Off atrasado.
    // O intervalo permite que a nova luz entre antes da saída da anterior.
    try {
        var onCommands = [];
        var offCommands = [];

        for (var a = 0; a < toOn.length; a++) {
            var exOn = byId[toOn[a]];
            if (!exOn) continue;
            onCommands.push('On Executor ' + exOn.address);
            _setExecutorVirtualState(module, exOn, true);
        }

        for (var b = 0; b < toOff.length; b++) {
            var exOff = byId[toOff[b]];
            if (!exOff) continue;
            offCommands.push({ command: 'Off Executor ' + exOff.address, executor: exOff });
        }

        var batchRuntime = _getExecutorBatchRuntime(module);
        if (batchRuntime.pendingOffTimerId) {
            module.clearTimeout(batchRuntime.pendingOffTimerId);
            batchRuntime.pendingOffTimerId = null;
            _moduleLog('O desligamento pendente foi cancelado por uma nova mudança de Executor.');
        }

        for (var i = 0; i < onCommands.length; i++) {
            jsc.ma2.sendCommand(receiverID, onCommands[i], opts);
        }

        var offDelayMs = parseInt(module.settings.executor_off_delay_ms, 10);
        if (isNaN(offDelayMs) || offDelayMs < 0) offDelayMs = 500;

        var sendOffPhase = function() {
            batchRuntime.pendingOffTimerId = null;
            for (var j = 0; j < offCommands.length; j++) {
                jsc.ma2.sendCommand(receiverID, offCommands[j].command, opts);
                _setExecutorVirtualState(module, offCommands[j].executor, false);
            }
            if (offCommands.length) {
                _moduleLog('Etapa de desligamento enviada após {} ms ({} comandos).', [offDelayMs, offCommands.length]);
            }
            module.updatePanel();
        };

        if (offCommands.length && offDelayMs > 0) {
            batchRuntime.pendingOffTimerId = module.setTimeout(sendOffPhase, offDelayMs);
        } else {
            sendOffPhase();
        }

        if (!onCommands.length && !offCommands.length && executors.length) {
            // Ajuda a diagnosticar quando o schema do input está dessync com o cadastro
            _moduleLog('Nenhum comando foi criado (ligar: {}, desligar: {}). O Holyrics pode ter armazenado IDs antigos em cache.', [toOn.length, toOff.length]);
        }

        _moduleLog('Lote de Executors: ligar enviados ({}), desligar agendados ({}, {} ms).', [onCommands.length, offCommands.length, offDelayMs]);
        h.notification(_moduleI18n('Executors: comandos enviados (ligar: {}, desligar: {})', [toOn.length, toOff.length]), 2);
        module.updatePanel();
    } catch (e) {
        _moduleLog('Erro ao executar o lote de Executors: {}', [e]);
        h.notification(_moduleI18n('Erro ao enviar comandos: {}', [e]), 4);
        module.updatePanel();
    }
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a226f626a6563744d6f64656c73227d
// v2.3.2 | 2026-09-03
// Autor: @prcris

// =========================
// Object Model de Executors
// =========================

function objectModels() {
    var arr = [];

    // Model simples de Executors (dispositivos) com estado virtual controlado no Holyrics
    arr.push({
        id: 'grandma2_executor',
        name: _moduleI18n("Executor da grandMA2 (código do botão)"),
        onchange: function () {
            module.updatePanel();
            _tryRefreshModuleActions(module, 'executors alterados');
        },
        struct: [
            {
                id: 'name',
                name: _moduleI18n("Nome no Holyrics"),
                type: 'string',
                description: _moduleI18n("Informe um nome fácil de reconhecer, como Cadeiras Centro ou Azul Escuro.")
            },
            {
                id: 'address',
                name: _moduleI18n("Código do Executor na grandMA2"),
                type: 'string',
                description: _moduleI18n("Informe o número exibido no canto superior esquerdo do botão Executor na grandMA2. Exemplo: 154 é tratado como 1.154. Para a página 2, informe o valor completo, como 2.140.")
            }
        ]
    });

    return arr;
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2273657474696e6773227d
// v2.5.1 | 2026-09-03
// Autor: @prcris

// Configurações do módulo

function settings() {
    return [
        { type: 'title', name: _moduleI18n("Conexão com a grandMA2") },
        { type: 'separator' },
        {
            type: 'label',
            name: _moduleI18n("Antes de começar"),
            description: '<html>' + _moduleI18n("Na grandMA2, abra Setup → Console → Global Settings → Telnet e selecione Login Enabled. No Holyrics, crie um receptor GrandMA2 com o IP da mesa; esse modelo já usa TCP e a porta 30000. Depois, selecione-o abaixo. A biblioteca cuida automaticamente da conexão, do login e do ping.")
        },
        {
            id: 'receiver_id',
            name: _moduleI18n("Receptor GrandMA2"),
            description: _moduleI18n("Selecione o receptor GrandMA2 configurado para a mesa"),
            type: 'receiver',
            receiver: 'grandma2'
        },
        { type: 'separator' },
        {
            id: 'log',
            label: _moduleI18n("Habilitar log"),
            type: 'boolean',
            onchange: function (obj) {
                var enabled = _coerceBoolean(obj && obj.input ? obj.input.log : false);
                try { jsc.ma2.setLogEnabled(enabled); } catch (e1) {}
                try { logState(enabled, mUID, 'onchange ' + mID); } catch (e2) {}
                try { logState(enabled, 'jsc.ma2', 'onchange ' + mID); } catch (e3) {}
            }
        },
        { type: 'separator' },
        { id: 'filter_prompt', type: 'boolean', label: _moduleI18n("Ocultar as linhas de prompt ([Fixture]>) nos logs"), default_value: true },
        {
            id: 'executor_off_delay_ms',
            type: 'number',
            label: _moduleI18n("Atraso antes de desligar os Executors anteriores (ms)"),
            description: _moduleI18n("Durante uma mudança em lote, a nova iluminação é ligada e este atraso é respeitado antes que a iluminação anterior seja desligada."),
            default_value: 500,
            min: 0,
            max: 5000
        },
        { type: 'separator' },
        {
            type: 'label',
            name: _moduleI18n("Como funcionam as tags de iluminação"),
            description: '<html>' + _moduleI18n("Há duas formas de associação: use uma tag no formato \"Nome | código do Executor\", ou abra o botão Configurar abaixo para informar o código ao lado de cada tag já existente. A abertura de músicas e apresentações automáticas é identificada pelos gatilhos de tema e plano de fundo. Tags do tema têm prioridade; o fundo é usado quando o tema não possui Executor associado. Se a mesma fonte apontar para vários Executors, somente o primeiro será usado e um alerta será exibido.")
        },
        {
            id: 'tag_exec_enable',
            type: 'boolean',
            label: _moduleI18n("Habilitar automação por tags do tema e do plano de fundo") ,
            description: _moduleI18n("Reage à exibição de temas e planos de fundo. Ao encerrar uma música ou apresentação automática, desliga o Executor ativo."),
            default_value: false
        },
        {
            id: 'configure_tag_executor_codes',
            type: 'button',
            name: _moduleI18n("Associar tags a Executors"),
            description: _moduleI18n("Abre uma lista com todas as tags disponíveis para informar o código do Executor correspondente."),
            button_label: _moduleI18n("Configurar"),
            action: function() {
                _openTagExecutorSettings(module);
            }
        },
        {
            id: 'tag_exec_schedule_filter',
            type: 'boolean',
            label: _moduleI18n("Restringir por evento (calendário)") ,
            description: _moduleI18n("Quando habilitado, a automação por tags funciona somente se o evento atual do calendário estiver na lista abaixo."),
            default_value: false
        },
        {
            id: 'tag_exec_allowed_schedules',
            type: 'textarea',
            name: _moduleI18n("Eventos permitidos (um por linha)"),
            description: _moduleI18n("Informe os nomes exatamente como aparecem no calendário do Holyrics. Se a lista estiver vazia, nada será executado enquanto o filtro estiver habilitado.")
        },
        { type: 'separator' },
        {
            type: 'label',
            name: _moduleI18n("Como cadastrar os Executors"),
            description: '<html>' + _moduleI18n("Abra o gerenciador da lista. Em Nome, informe como a iluminação deve ser identificada no Holyrics. Em Código, informe o número do botão Executor, como 145, 154 ou 166; o módulo adiciona a página 1 automaticamente. Para outra página, use o formato completo, como 2.140.")
        },
        {
            id: 'grandma2_executors',
            type: 'object_model_manage_list',
            model: 'grandma2_executor',
            name: _moduleI18n("Executors da grandMA2"),
            description: _moduleI18n("Cadastre o nome e o código de cada Executor. O módulo mantém um estado virtual LIGADO/DESLIGADO para ações em lote e mudanças de iluminação.")
        }
    ];
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a227461675f66756e6374696f6e73227d
// v2.5.0 | 2026-09-03
// Autor: @prcris

// =========================
// Helpers internos para Tag → Executors (triggers)
// =========================

function _toTagArray(v) {
    if (!v) return [];
    if (Array.isArray ? Array.isArray(v) : (v instanceof Array)) return v;
    if (typeof v === 'object' && typeof v.length === 'number') {
        var arr = [];
        for (var i = 0; i < v.length; i++) {
            if (v[i] != null) arr.push('' + v[i]);
        }
        return arr;
    }
    if (typeof v === 'string' && v.trim()) return [v.trim()];
    return [];
}

function _mergeTagArrays(first, second) {
    var out = [];
    var seen = {};

    function addAll(values) {
        values = values || [];
        for (var i = 0; i < values.length; i++) {
            var tag = _normalizeTagName(values[i]);
            var key = tag.toLowerCase();
            if (!tag || seen[key]) continue;
            seen[key] = true;
            out.push(tag);
        }
    }

    addAll(first);
    addAll(second);
    return out;
}

function _normalizeTagName(tag) {
    return ('' + (tag || '')).trim();
}

// Gera um ID estável e seguro para salvar o Executor associado a cada tag.
function _tagExecutorSettingId(tag) {
    var normalized = _normalizeTagName(tag).toLowerCase();
    var hash = 0;
    for (var i = 0; i < normalized.length; i++) {
        hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
        hash = hash & hash;
    }
    var readable = normalized.replace(/[^a-z0-9_-]/g, '_').substring(0, 32);
    return 'tag_executor_' + Math.abs(hash) + '_' + readable;
}

// Retorna todas as tags de temas e planos de fundo cadastradas no Holyrics.
function _getAllBackgroundTags() {
    var seen = {};
    var tags = [];

    function add(value) {
        var tag = _normalizeTagName(value);
        var key = tag.toLowerCase();
        if (!tag || seen[key]) return;
        seen[key] = true;
        tags.push(tag);
    }

    try {
        var response = h.hly('GetBackgroundTags');
        var directTags = response && response.data ? response.data : [];
        for (var i = 0; i < directTags.length; i++) add(directTags[i]);
    } catch (tagError) {
        _moduleLog('Não foi possível listar as tags diretamente: {}', [tagError]);
    }

    // Fallback e complemento para instalações que não retornem todos os tipos.
    var collections = [];
    try { collections.push(h.hly('GetBackgrounds', {})); } catch (backgroundError) {
        _moduleLog('Não foi possível listar os planos de fundo: {}', [backgroundError]);
    }
    try { collections.push(h.hly('GetThemes')); } catch (themeError) {
        _moduleLog('Não foi possível listar os temas: {}', [themeError]);
    }

    for (var c = 0; c < collections.length; c++) {
        var items = collections[c] && collections[c].data ? collections[c].data : [];
        for (var b = 0; b < items.length; b++) {
            var itemTags = _toTagArray(items[b] && items[b].tags);
            for (var t = 0; t < itemTags.length; t++) add(itemTags[t]);
        }
    }

    tags.sort(function(a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : (a.toLowerCase() > b.toLowerCase() ? 1 : 0);
    });
    return tags;
}

// Abre uma única janela com um campo de código de Executor para cada tag.
function _openTagExecutorSettings(module) {
    var tags = _getAllBackgroundTags();
    if (!tags.length) {
        h.notification(_moduleI18n('Nenhuma tag de tema ou plano de fundo foi encontrada.'), 4);
        return;
    }

    var inputs = [
        { type: 'title', name: _moduleI18n('Executors associados às tags') },
        { type: 'separator' },
        {
            type: 'label',
            name: _moduleI18n('Como preencher'),
            description: '<html>' + _moduleI18n('Informe o código do Executor correspondente a cada tag. Exemplo: 145 será tratado como 1.145; para outra página, use o formato completo, como 2.140. Deixe o campo vazio quando a tag não controlar a iluminação.')
        },
        { type: 'separator' }
    ];

    for (var i = 0; i < tags.length; i++) {
        inputs.push({
            id: _tagExecutorSettingId(tags[i]),
            type: 'string',
            name: tags[i],
            description: _moduleI18n('Código do Executor associado à tag "{}".', [tags[i]])
        });
    }

    module.inputSettings('tag_executor_codes', inputs);
}

function _getConfiguredExecutorForTag(module, tag) {
    var config = module && module.settings ? (module.settings.tag_executor_codes || {}) : {};
    return _normalizeExecutorAddressText(config[_tagExecutorSettingId(tag)] || '');
}

// Extrai o código do executor embutido na tag, formato "NomeTag|codigo"
// Ex.: "Azul|145" → "1.145" após normalização; "Verde" → ''
function _parseInlineTagExecutor(rawTag) {
    rawTag = ('' + (rawTag || '')).trim();
    var pipeIdx = rawTag.indexOf('|');
    if (pipeIdx < 0) return { tag: rawTag, inlineExecutor: '' };
    return {
        tag: rawTag.substring(0, pipeIdx).trim(),
        inlineExecutor: rawTag.substring(pipeIdx + 1).trim()
    };
}

// Retorna lista de códigos de executor presentes nas tags (formato NomeTag|cod)
function _extractExecutorsFromTags(tags) {
    var out = [];
    for (var i = 0; i < tags.length; i++) {
        var parsed = _parseInlineTagExecutor('' + tags[i]);
        if (parsed.inlineExecutor) {
            out.push(_normalizeExecutorAddressText(parsed.inlineExecutor));
        }
    }
    return out;
}

// Aceita simultaneamente os dois modelos:
// 1. código embutido na tag, como "Azul | 145";
// 2. código informado na janela de associação de tags.
function _extractExecutorsForTags(module, tags) {
    var out = [];
    var seen = {};

    function add(address) {
        address = _normalizeExecutorAddressText(address);
        if (!address || seen[address]) return;
        seen[address] = true;
        out.push(address);
    }

    tags = tags || [];
    for (var i = 0; i < tags.length; i++) {
        var parsed = _parseInlineTagExecutor(tags[i]);
        add(parsed.inlineExecutor);
        add(_getConfiguredExecutorForTag(module, parsed.tag || tags[i]));
    }
    return out;
}

// =========================
// Verificação manual: música → tema → tag de cena
// =========================

function _extractThemeId(value) {
    if (value === null || typeof value === 'undefined' || value === '') return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (value.id !== null && typeof value.id !== 'undefined') return String(value.id);
    if (value.background_id !== null && typeof value.background_id !== 'undefined') {
        return String(value.background_id);
    }
    return '';
}

function _addThemeToAuditMap(map, theme) {
    if (!theme) return;
    var id = _extractThemeId(theme);
    var name = theme.name ? String(theme.name) : '';
    if (id) map.byId[id] = theme;
    if (name) map.byName[name.toLowerCase()] = theme;
}

function _loadLightingAuditThemes() {
    var map = { byId: {}, byName: {} };
    var responses = [];

    try { responses.push(h.hly('GetThemes')); } catch (e1) {
        _moduleLog('Auditoria da iluminação: falha em GetThemes: {}', [e1]);
    }
    try { responses.push(h.hly('GetBackgrounds', {})); } catch (e2) {
        _moduleLog('Auditoria da iluminação: falha em GetBackgrounds: {}', [e2]);
    }

    for (var r = 0; r < responses.length; r++) {
        var items = responses[r] && responses[r].data ? responses[r].data : [];
        for (var i = 0; i < items.length; i++) {
            _addThemeToAuditMap(map, items[i]);
        }
    }
    return map;
}

function _findAuditTheme(themeMap, value) {
    var id = _extractThemeId(value);
    if (id && themeMap.byId[id]) return themeMap.byId[id];

    if (typeof value === 'string') {
        var byName = themeMap.byName[value.toLowerCase()];
        if (byName) return byName;
    }
    if (value && typeof value === 'object' && value.name) {
        var objectByName = themeMap.byName[String(value.name).toLowerCase()];
        if (objectByName) return objectByName;
    }
    return null;
}

function _themeHasLightingSceneTag(module, theme) {
    if (!theme) return false;
    return _extractExecutorsForTags(module, _toTagArray(theme.tags)).length > 0;
}

function _getSongAuditThemeIds(song) {
    var ids = [];
    var seen = {};

    function add(value) {
        var id = _extractThemeId(value);
        if (!id || seen[id]) return;
        seen[id] = true;
        ids.push(id);
    }

    add(song && song.theme);
    var slides = song && song.slides ? song.slides : [];
    for (var i = 0; i < slides.length; i++) {
        add(slides[i] && slides[i].background_id);
    }
    return ids;
}

function _getPlaylistSongId(item) {
    if (!item) return '';
    if (item.song_id !== null && typeof item.song_id !== 'undefined' && item.song_id !== '') {
        return String(item.song_id);
    }
    if (item.id !== null && typeof item.id !== 'undefined' && item.id !== '') {
        return String(item.id);
    }
    return '';
}

function _auditPlaylistLighting(module) {
    var result = { issues: [], songCount: 0, errors: [] };
    var playlistResponse;

    try {
        playlistResponse = h.hly('GetMediaPlaylist');
    } catch (e1) {
        result.errors.push('Não foi possível ler a lista de mídias: ' + e1);
        return result;
    }

    var playlist = playlistResponse && playlistResponse.data ? playlistResponse.data : [];
    var themeMap = _loadLightingAuditThemes();
    var songs = {};
    var issueKeys = {};

    for (var i = 0; i < playlist.length; i++) {
        var playlistItem = playlist[i] || {};
        var itemType = String(playlistItem.type || '').toLowerCase();
        if (itemType !== 'song' && itemType !== 'lyrics') continue;

        var songId = _getPlaylistSongId(playlistItem);
        if (!songId || songs[songId]) continue;
        songs[songId] = true;
        result.songCount++;

        var songResponse;
        try {
            songResponse = h.hly('GetSong', {
                id: songId,
                fields: 'id,title,theme,slides'
            });
        } catch (songError) {
            result.errors.push('Música "' + (playlistItem.name || songId) + '": ' + songError);
            continue;
        }

        var song = songResponse && songResponse.data ? songResponse.data : null;
        var songName = song && song.title ? String(song.title) : String(playlistItem.name || songId);
        if (!song) {
            result.errors.push('Não foi possível carregar a música "' + songName + '".');
            continue;
        }

        var themeIds = _getSongAuditThemeIds(song);
        if (!themeIds.length) {
            var missingThemeKey = songId + '|no-theme';
            if (!issueKeys[missingThemeKey]) {
                issueKeys[missingThemeKey] = true;
                result.issues.push({
                    songId: songId,
                    songName: songName,
                    themeId: '',
                    themeName: _moduleI18n("Nenhum tema está associado à música")
                });
            }
            continue;
        }

        for (var t = 0; t < themeIds.length; t++) {
            var themeId = themeIds[t];
            var theme = _findAuditTheme(themeMap, themeId);
            if (theme && _themeHasLightingSceneTag(module, theme)) continue;

            var issueKey = songId + '|' + themeId;
            if (issueKeys[issueKey]) continue;
            issueKeys[issueKey] = true;
            result.issues.push({
                songId: songId,
                songName: songName,
                themeId: themeId,
                themeName: theme && theme.name
                    ? String(theme.name)
                    : _moduleI18n("Tema não encontrado (ID {})", [themeId])
            });
        }
    }

    return result;
}

function _showLightingAuditDialog(result) {
    var content = [
        { type: 'title', label: _moduleI18n("ATENÇÃO: A ILUMINAÇÃO NÃO ESTÁ CONFIGURADA") },
        { type: 'separator' }
    ];

    for (var i = 0; i < result.issues.length; i++) {
        content.push({ type: 'title', label: _moduleI18n("Música: ") + result.issues[i].songName });
        content.push({ type: 'title', label: _moduleI18n("Tema: ") + result.issues[i].themeName });
        content.push({ type: 'separator' });
    }

    content.push({
        type: 'title',
        label: _moduleI18n("Associe uma tag ao Executor nas configurações do módulo ou use o formato \"Nome | código\" (por exemplo, \"Azul | 145\" para 1.145 ou \"Azul | 2.140\").")
    });
    h.input(content);
}

function _getTagExecRuntime(module) {
    var root = h.global.grandma2_tag_exec_runtime || {};
    h.global.grandma2_tag_exec_runtime = root;
    var moduleKey = mID + '_' + (module && module.id ? module.id : '');
    if (!root[moduleKey]) {
        root[moduleKey] = {
            activeTags: [],
            activeExecutors: [],
            backgroundKey: '',
            lastConflictKey: '',
            activePresentationID: '',
            activePresentationType: ''
        };
    }
    var rt = root[moduleKey];
    if (!(rt.activeTags && typeof rt.activeTags.length === 'number')) rt.activeTags = [];
    if (!(rt.activeExecutors && typeof rt.activeExecutors.length === 'number')) rt.activeExecutors = [];
    if (typeof rt.backgroundKey !== 'string') rt.backgroundKey = '';
    if (typeof rt.lastConflictKey !== 'string') rt.lastConflictKey = '';
    if (typeof rt.activePresentationID !== 'string') rt.activePresentationID = '';
    if (typeof rt.activePresentationType !== 'string') rt.activePresentationType = '';
    return rt;
}

function _resetTagExecRuntime(module) {
    var rt = _getTagExecRuntime(module);
    rt.activeTags = [];
    rt.activeExecutors = [];
    rt.backgroundKey = '';
    rt.lastConflictKey = '';
    rt.activePresentationID = '';
    rt.activePresentationType = '';
}

function _isTagAutomationAllowedBySchedule(module) {
    if (!module.settings.tag_exec_schedule_filter) return true;

    var raw = String(module.settings.tag_exec_allowed_schedules || '');
    var lines = raw.split(/\r?\n/);
    var allowed = {};
    for (var i = 0; i < lines.length; i++) {
        var name = lines[i].trim().toLowerCase();
        if (name) allowed[name] = true;
    }

    try {
        var response = h.hly('GetCurrentSchedule');
        var schedules = response && response.data ? response.data : [];
        for (var s = 0; s < schedules.length; s++) {
            var currentName = String((schedules[s] && schedules[s].name) || '').trim().toLowerCase();
            if (currentName && allowed[currentName]) return true;
        }
    } catch (e) {
        _moduleLog('Não foi possível verificar o evento atual: {}', [e]);
    }
    return false;
}

// Consulta separadamente o plano de fundo e o tema atuais.
// O Executor associado ao tema tem prioridade. Quando o tema não possui uma
// associação válida, as tags do plano de fundo controlam a iluminação.
function _getCurrentLightingTagState(module, themeOverride, backgroundOverride) {
    var background = backgroundOverride || null;
    var theme = themeOverride || null;

    if (!background) {
        try {
            var backgroundResponse = h.hly('GetCurrentBackground');
            background = backgroundResponse && backgroundResponse.data ? backgroundResponse.data : null;
        } catch (backgroundError) {
            _moduleLog('Não foi possível consultar o plano de fundo atual: {}', [backgroundError]);
        }
    }

    if (!theme) {
        try {
            var themeResponse = h.hly('GetCurrentTheme');
            theme = themeResponse && themeResponse.data ? themeResponse.data : null;
        } catch (themeError) {
            _moduleLog('Não foi possível consultar o tema atual: {}', [themeError]);
        }
    }

    var backgroundTags = _toTagArray(background && background.tags);
    var themeTags = _toTagArray(theme && theme.tags);
    var backgroundExecutors = _extractExecutorsForTags(module, backgroundTags);
    var themeExecutors = _extractExecutorsForTags(module, themeTags);
    var effectiveTags = themeExecutors.length ? themeTags : backgroundTags;
    var candidateExecutors = themeExecutors.length ? themeExecutors : backgroundExecutors;
    var effectiveExecutors = candidateExecutors.length ? [candidateExecutors[0]] : [];
    var source = themeExecutors.length ? 'tema' : (backgroundExecutors.length ? 'plano de fundo' : 'nenhuma associação');
    var allTags = _mergeTagArrays(backgroundTags, themeTags);

    return {
        background: background,
        theme: theme,
        backgroundTags: backgroundTags,
        themeTags: themeTags,
        tags: effectiveTags,
        executors: effectiveExecutors,
        candidateExecutors: candidateExecutors,
        hasConflict: candidateExecutors.length > 1,
        source: source,
        key: [
            background && background.type ? background.type : '',
            background && background.id ? background.id : '',
            background && background.name ? background.name : '',
            theme && theme.id ? theme.id : '',
            theme && theme.name ? theme.name : '',
            allTags.slice().sort().join('|'),
            source
        ].join('::')
    };
}

// Exibe uma única notificação para cada conflito encontrado pelos gatilhos.
// A ordem das tags retornada pelo Holyrics define qual Executor é o primeiro.
function _notifyTagExecutorConflict(module, state) {
    var rt = _getTagExecRuntime(module);
    if (!state || !state.hasConflict) {
        rt.lastConflictKey = '';
        return;
    }

    var candidates = state.candidateExecutors || [];
    var conflictKey = state.key + '::' + candidates.join('|');
    if (rt.lastConflictKey === conflictKey) return;
    rt.lastConflictKey = conflictKey;

    var item = state.source === 'tema' ? state.theme : state.background;
    var sourceLabel = state.source === 'tema' ? _moduleI18n('O tema') : _moduleI18n('O plano de fundo');
    var selected = state.executors.length ? state.executors[0] : '';
    var message = _moduleI18n('{} "{}" possui mais de um Executor associado às suas tags ({}). Apenas o primeiro, {}, será utilizado.', [
        sourceLabel,
        item && item.name ? item.name : '',
        candidates.join(', '),
        selected
    ]);

    try {
        h.notificationError(message, 8);
    } catch (notificationError) {}
}

// Desliga imediatamente os executors associados ao tema ativo e limpa o estado.
// A limpeza antes do envio impede que um closing tardio repita o mesmo OFF.
function _turnOffActiveTagExecutors(module, reason) {
    var rt = _getTagExecRuntime(module);
    var active = rt.activeTags || [];
    var activeExecutors = rt.activeExecutors || _extractExecutorsForTags(module, active);
    if (!activeExecutors.length) {
        _resetTagExecRuntime(module);
        return false;
    }

    var executorsToOff = activeExecutors.slice ? activeExecutors.slice() : activeExecutors;
    _resetTagExecRuntime(module);
    _moduleLog('{}: executors=[{}]', [reason, executorsToOff.join(', ')]);
    _applyExecutorAddresses(module, executorsToOff, 'end', active);
    return true;
}

function _applyExecutorAddresses(module, executors, phase, tags) {
    executors = executors || [];
    tags = tags || [];
    if (!executors.length) return;
    var receiverID = module.settings.receiver_id;
    if (!receiverID) {
        _moduleLog('O receptor não está configurado (tags de Executor).');
        return;
    }

    var opts = { username: 'Administrator', password: 'admin' };
    try {
        if (phase === 'start') {
            _moduleLog('LIGAR tags=[{}] executors=[{}]', [tags.join(', '), executors.join(', ')]);
            for (var x = 0; x < executors.length; x++) {
                jsc.ma2.sendCommand(receiverID, 'On Executor ' + executors[x], opts);
            }
        } else if (phase === 'end') {
            _moduleLog('DESLIGAR tags=[{}] executors=[{}]', [tags.join(', '), executors.join(', ')]);
            for (var y = 0; y < executors.length; y++) {
                jsc.ma2.sendCommand(receiverID, 'Off Executor ' + executors[y], opts);
            }
        }
    } catch (e) {
        _moduleLog('Erro ao executar as tags de Executor ({}): {}', [phase, e]);
    }
}

function _applyExecutorsForTags(module, tags, phase) {
    tags = tags || [];
    _applyExecutorAddresses(module, _extractExecutorsForTags(module, tags), phase, tags);
}

// Aplica executors somente se as tags mudaram em relação ao estado ativo.
// Se forem as mesmas tags, mantém o executor ligado sem desligar/religar.
function _applyTagsIfChanged(module, tags, label, backgroundKey, resolvedExecutors) {
    var rt = _getTagExecRuntime(module);

    var prev = rt.activeTags || [];
    var previousExecutors = rt.activeExecutors || _extractExecutorsForTags(module, prev);
    var nextExecutors = resolvedExecutors !== null && typeof resolvedExecutors !== 'undefined'
        ? resolvedExecutors
        : _extractExecutorsForTags(module, tags || []);
    var previousKey = previousExecutors.slice().sort().join('|');
    var nextKey = nextExecutors.slice().sort().join('|');

    if (previousKey === nextKey) {
        rt.activeTags = tags || [];
        rt.activeExecutors = nextExecutors;
        rt.backgroundKey = backgroundKey || '';
        return;
    }

    var keep = {};
    var turnOn = [];
    var turnOff = [];
    var i;

    for (i = 0; i < nextExecutors.length; i++) keep[nextExecutors[i]] = true;
    for (i = 0; i < nextExecutors.length; i++) {
        if (previousExecutors.indexOf(nextExecutors[i]) < 0) turnOn.push(nextExecutors[i]);
    }
    for (i = 0; i < previousExecutors.length; i++) {
        if (!keep[previousExecutors[i]]) turnOff.push(previousExecutors[i]);
    }

    // Liga o novo Executor primeiro e só depois desliga o anterior.
    _applyExecutorAddresses(module, turnOn, 'start', tags);
    _applyExecutorAddresses(module, turnOff, 'end', prev);

    rt.activeTags = tags || [];
    rt.activeExecutors = nextExecutors;
    rt.backgroundKey = backgroundKey || '';
    _moduleLog('{}: ativos=[{}].', [label, nextExecutors.join(', ')]);
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a227472696767657273227d
// v2.5.1 | 2026-09-03
// Autor: @prcris

// Gatilhos de tema, plano de fundo, músicas e apresentações automáticas.

function _handleLightingDisplayTrigger(module, triggerName, eventType, obj) {
    _moduleLog('GATILHO: exibindo {}.', [triggerName]);
    if (!module.settings.tag_exec_enable) return;
    if (!_isTagAutomationAllowedBySchedule(module)) {
        _turnOffActiveTagExecutors(module, triggerName + ': evento atual não permitido');
        return;
    }

    try {
        var themeOverride = eventType === 'theme' ? obj : null;
        var backgroundOverride = eventType === 'background' ? obj : null;
        var state = _getCurrentLightingTagState(module, themeOverride, backgroundOverride);
        if (!state.background && !state.theme) {
            _moduleLog('{}: tema e plano de fundo não foram encontrados.', [triggerName]);
            return;
        }

        _moduleLog('{}: fundo="{}" tags=[{}]; tema="{}" tags=[{}]; usando {} executors=[{}]', [
            triggerName,
            state.background && state.background.name ? state.background.name : '',
            state.backgroundTags.join(', '),
            state.theme && state.theme.name ? state.theme.name : '',
            state.themeTags.join(', '),
            state.source,
            state.executors.join(', ')
        ]);

        _notifyTagExecutorConflict(module, state);
        _applyTagsIfChanged(module, state.tags, triggerName, state.key, state.executors);

        // Os gatilhos de tema e fundo também ocorrem na abertura da apresentação.
        // Guarda a apresentação corrente para validar o respectivo closing.
        try {
            var currentResponse = h.hly('GetCurrentPresentation');
            var current = currentResponse && currentResponse.data ? currentResponse.data : null;
            if (current && (current.type === 'song' || current.type === 'automatic_presentation')) {
                var rt = _getTagExecRuntime(module);
                rt.activePresentationID = current.id !== null && typeof current.id !== 'undefined' ? String(current.id) : '';
                rt.activePresentationType = String(current.type);
            }
        } catch (presentationError) {
            _moduleLog('Não foi possível identificar a apresentação atual em {}: {}', [triggerName, presentationError]);
        }
    } catch (e) {
        _moduleLog('Erro no gatilho {}: {}', [triggerName, e]);
    }
}

function _handleLightingCloseTrigger(module, triggerName, eventType, obj) {
    _moduleLog('GATILHO: encerrando {}.', [triggerName]);
    var rt = _getTagExecRuntime(module);
    var closingID = obj && obj.id !== null && typeof obj.id !== 'undefined' ? String(obj.id) : '';

    // Ignora um encerramento atrasado de uma apresentação anterior.
    if (rt.activePresentationType && rt.activePresentationType !== eventType) return;
    if (rt.activePresentationID && closingID && rt.activePresentationID !== closingID) return;

    _turnOffActiveTagExecutors(module, triggerName);
}

function triggers(module) {
    var arr = [];

    function addDisplay(id, item, eventType) {
        arr.push({
            id: mUID + '_tag_exec_display_' + id,
            when: 'displaying',
            item: item,
            action: function(obj) {
                _handleLightingDisplayTrigger(module, item, eventType, obj);
            }
        });
    }

    function addClose(id, item, eventType) {
        arr.push({
            id: mUID + '_tag_exec_close_' + id,
            when: 'closing',
            item: item,
            action: function(obj) {
                _handleLightingCloseTrigger(module, item, eventType, obj);
            }
        });
    }

    addDisplay('theme', 'any_theme', 'theme');
    addDisplay('background', 'any_background', 'background');
    addClose('song', 'any_song', 'song');
    addClose('automatic_presentation', 'any_automatic_presentation', 'automatic_presentation');

    return arr;
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a2273746172747570227d
// v2.5.0 | 2026-09-03
// Autor: @prcris

// Inicialização e encerramento do módulo

function startup(module) {
    mUID = mID + module.id;

    var logOn = module.settings && module.settings.log === true;
    try { jsc.ma2.setLogEnabled(logOn); } catch(e) {}
    try { logState(logOn, mUID, 'startup'); } catch(e) {}
    try { logState(logOn, 'jsc.ma2', 'startup'); } catch(e) {}

    // Estado virtual começa sempre em OFF em cada inicialização do módulo.
    _clearExecutorVirtualStore(module);
    _resetTagExecRuntime(module);

    // A conexão é automática ao enviar o primeiro comando, não precisa mais conectar no startup
}

function shutdown(module) {
    // Ao encerrar, zerar o estado virtual (assumir tudo OFF)
    _clearExecutorVirtualStore(module);

    var receiverID = module.settings.receiver_id;
    if (receiverID && jsc.ma2.isConnected(receiverID)) {
        try {
            jsc.ma2.disconnect(receiverID);
            _moduleLog('Conexão encerrada durante a finalização do módulo.');
        } catch (e) {
            _moduleLog('Erro ao encerrar a conexão durante a finalização do módulo: {}', [e]);
        }
    }
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a22616374696f6e73227d
// v2.3.2 | 2026-09-03
// Autor: @prcris

// Ações exibidas no painel do módulo

function actions(module) {
    var act = [];

    act.push({
        id: 'check_cult_lighting',
        label: '',
        icon: 'fact_check',
        hint: _moduleI18n("Verificar iluminação do culto"),
        action: function () {
            var result = _auditPlaylistLighting(module);
            if (result.issues.length) {
                _showLightingAuditDialog(result);
                return;
            }
            if (result.errors.length) {
                _moduleLog('Verificação manual da iluminação: {}', [result.errors.join(' | ')]);
                h.notificationError(_moduleI18n("Não foi possível concluir a verificação da iluminação. Consulte o log do módulo."), 6);
                return;
            }
            h.notification(_moduleI18n("Iluminação verificada: {} música(s), nenhum problema encontrado.", [result.songCount]), 4);
        }
    });

    return act;
}
// __SCRIPT_SEPARATOR__ - info:7b226e616d65223a227075626c6963416374696f6e73227d
// v2.3.2 | 2026-09-03
// Autor: @prcris

// Ações públicas disponíveis para outras automações

function publicActions(mod) {
    // Compat: alguns contextos chamam sem parâmetro, mas expõem "module" global.
    if (!mod && typeof module !== 'undefined') {
        mod = module;
    }

    var list = [];

    var executorsForInput = [];
    try {
        executorsForInput = _getExecutorsFromSettings(mod);
    } catch (e0) {
        executorsForInput = [];
    }

    // PublicAction única (batch) para executar vários executors de uma vez
    list.push({
        id: 'executors_batch',
        name: _moduleI18n("Executors da grandMA2 (lote)"),
        icon: 'emoji_objects',
        description: _moduleI18n("Selecione os Executors que devem permanecer ligados; os não selecionados serão desligados automaticamente."),
        input: (executorsForInput && executorsForInput.length)
            ? _buildExecutorBatchInputs(mod, executorsForInput)
            : [
                { type: 'title', name: _moduleI18n("Cadastre os Executors nas configurações") }
            ],
        action: function(evt) {
            try {
                // Alguns contextos passam evt.input, outros passam o objeto direto
                var input = (evt && evt.input) ? evt.input : (evt || {});

                if (mod && mod.settings && mod.settings.log) {
                    var keys = [];
                    for (var k in input) {
                        keys.push(k);
                    }
                    _moduleLog('executors_batch (campos: {}).', [keys.length]);
                }

                _runExecutorBatch(mod, input);
            } catch (e) {
                _moduleLog('Erro na ação pública executors_batch: {}', [e]);
                h.notification(_moduleI18n('Erro ao executar a ação de Executors: {}', [e]), 4);
            }
        }
    });

    return list;
}
