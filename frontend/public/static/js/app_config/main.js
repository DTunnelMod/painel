import { InternalError } from "../common/errors.js";
import { AppConfigAdvancedViewFooter, AppConfigViewFooter } from "./components/footer.js";
import CardDefault from "./components/card.js";
import {
    Column, InputBoolean, InputHtml,
    InputImage, InputSelect, InputString, InputText, InputUrl
} from "./components/form.js";

import Pagination from "../common/pagination.js";

import AppCustomModal from "./modals/custom.js";
import AppConfigExportModal from "./modals/export.js";
import AppConfigImportModal from "./modals/import.js";
import UpdateModal from "./modals/update.js";
import ApkDownloadModal from "./modals/apkDownload.js";

import AppConfig from "./models.js";
import { AppConfigAdvancedView } from "./components/app.js";
import AppConfigView from "./components/app.js";
import DialogMenuImpl from "./dialog/menu.js";
import DialogPicker from "./components/core/dialogPicker.js";
import CodeEditorModal from "./modals/code.js";
import { ComponentStyled } from "./components/core/base.js";

class Observable {
    constructor() {
        this.observers = [];
    }

    observe(callback) {
        this.observers.push(callback);
    }

    removeObserve(callback) {
        this.observers.splice(this.observers.indexOf(callback), 1);
    }

    notify(event, data) {
        this.observers.forEach(callback => callback(event, data));
    }
}

class AppConfigList extends Observable {
    constructor() {
        super();
        this.items = [];  // Array<AppConfig>
    }

    add(item) {
        this.items.push(item);
    }

    get(id) {
        return this.items.find(item => item.id === id);
    }

    toggle(id) {
        const item = this.get(id);
        const index = this.items.indexOf(item);

        const item2 = this.items[0];
        item2.id = item.id;

        this.items[0] = item;
        this.items[index] = item2;

        delete item.id;
        this.notify('toggle', item2.id);
    }

    remove(id) {
        const item = this.get(id);
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
        this.notify('delete', item);
    }

    clear() {
        this.items = [];
        this.notify('clear');
    }
}

const createIconsFooter = (config, list) => {
    const footer = new AppConfigViewFooter({
        toggle: config.id,
        delete: config.id,
        code: config.app_layout_webview != null
    });

    const updateModal = new UpdateModal(createInputApp(config));
    updateModal.setOnClickSave(() => list.notify('update', config));
    updateModal.setOnClickCancel(() => updateModal.hide());
    footer.setOnClickEdit(() => updateModal.show());

    const code = CodeEditorModal.create(config.get('APP_LAYOUT_WEBVIEW'));
    footer.setOnClickCode(() => {
        if (config.app_layout_webview) {
            code.show();
        }
    });

    footer.setOnClickToggle(() => list.toggle(config.id));
    footer.setOnClickDelete(() => showAlertConfirm(() => list.remove(config.id)));

    const appConfigView = new AppConfigView(config, {
        maxWidth: '270px',
        height: '400px',
        padding: '0 15px',
    });
    const appConfigExportModal = new AppConfigExportModal(config, appConfigView);
    footer.setOnClickExport(() => appConfigExportModal.show());

    const appCustomModal = new AppCustomModal()
    const appAdvancedView = new AppConfigAdvancedView(config);
    const customFooter = new AppConfigAdvancedViewFooter(config.get('APP_BACKGROUND_TYPE').value.selected);

    customFooter.setOnClickMinimize(() => appCustomModal.hide());
    customFooter.setOnClickToggleBackground(type => {
        config.app_background_type.selected = type;
        config.notify()
    })

    customFooter.setOnClickSave(() => list.notify('update', config));

    customFooter.setOnMenuClick(() => {
        const dialogMenu = new DialogMenuImpl(config);
        const dialogConfig = dialogMenu.dialogConfig;
        const dialogDefault = dialogMenu.dialogDefault;
        const dialogLogger = dialogMenu.dialogLogger;

        dialogConfig.setStyle({ background: config.app_card_config_color })
        dialogConfig.setOnClickListener(() => {
            const picker = new DialogPicker(appAdvancedView.element, null);
            picker.setOnColorChange(color => {
                dialogConfig.setStyle({ background: color });
                config.app_card_config_color = color;
            });
            picker.setColor(config.app_card_config_color);
            picker.render();
        });

        dialogDefault.setStyle({ background: config.app_dialog_background_color })
        dialogDefault.dialogHeader.closeButtonIcon.style.color = config.app_icon_color;
        dialogDefault.setOnClickListener(() => {
            const picker = new DialogPicker(appAdvancedView.element, null);
            picker.setOnColorChange(color => {
                dialogDefault.setStyle({ background: color });
                config.app_dialog_background_color = color;
            });
            picker.setColor(config.app_dialog_background_color);
            picker.render();
        });

        dialogLogger.setStyle({ background: config.app_dialog_logger_color })
        dialogLogger.dialogHeader.closeButtonIcon.style.color = config.app_icon_color;
        dialogLogger.setOnClickListener(() => {
            const picker = new DialogPicker(appAdvancedView.element, null);
            picker.setOnColorChange(color => {
                dialogLogger.setStyle({ background: color });
                config.app_dialog_logger_color = color;
            });
            picker.setColor(config.app_dialog_logger_color);
            picker.render();
        });

        dialogMenu.render();
    });

    appCustomModal.setApp(appAdvancedView);
    appCustomModal.setFooter(customFooter);
    footer.setOnClickPhone(() => appCustomModal.show());

    return footer;
}

const createInputApp = (config) => {
    const columns = [];
    const factory = {
        'STRING': item => {
            const input = new InputString(item);
            input.setOnChange((value) => {
                item.value = value;
                config.notify();
            });
            return input;
        },
        'TEXT': item => {
            const input = new InputText(item);
            input.setOnChange((value) => {
                item.value = value;
                config.notify();
            });
            return input;
        },
        'IMAGE': item => {
            const input = new InputImage(item)
            input.setOnChange((value) => {
                item.value = value;
                config.notify();
            });
            return input;
        },
        'BOOLEAN': item => {
            const input = new InputBoolean(item);

            if (item.name == 'APP_LAYOUT_WEBVIEW_ENABLED') {
                input.setValidator(value => {
                    if (!config.app_layout_webview && value) {
                        throw new Error('LAYOUT WEBVIEW Não pode ficar vazio.')
                    }
                });
            }

            input.setOnChange(value => {
                item.value = value;
                config.notify();
            });

            return input;
        },
        'SELECT': item => {
            const input = new InputSelect(item);
            input.setOnChange((value) => {
                item.value.selected = value;
                config.notify();
            });
            return input;
        },
        'URL': item => {
            const input = new InputUrl(item);
            input.setOnChange((value) => {
                item.value = value;
                config.notify();
            });
            return input;
        },
        'HTML': item => {
            const input = new InputHtml(item);
            input.setOnChange((value) => {
                item.value = value;
                config.notify();
            });
            return input;
        },
    }
    config.items.forEach(item => {
        const func = factory[item.type];
        if (!func) return;
        columns.push(new Column(func(item)));
    })
    return columns;
}

const renderCard = (root, appConfigList) => {
    const cardDefault = new CardDefault();

    cardDefault.setOnBtnCreateClick(() => appConfigList.notify('create', null));

    const appConfigImportModal = new AppConfigImportModal();
    appConfigImportModal.setCallbackOnImport(data => {
        const config = AppConfig.fromJson({ app_config: data, id: null });
        appConfigList.add(config);
        appConfigList.notify('import', config);
        appConfigImportModal.modal.hide();
    })
    cardDefault.setOnBtnImportClick(() => appConfigImportModal.show());

    cardDefault.setOnBtnSyncClick(() => showAlertConfirm(() => appConfigList.notify('sync', null)));

    const apkDownloadModal = new ApkDownloadModal();
    cardDefault.setOnBtnApkDownloadClick(() => apkDownloadModal.show());

    root.appendChild(cardDefault.element);
}

const renderApp = appConfigList => {
    const root = document.querySelector('.row');
    root.innerHTML = '';

    if (appConfigList.items.length == 0)
        return renderCard(root, appConfigList);

    appConfigList.items.forEach(async item => {

        const app = new AppConfigView(item, {
            maxWidth: '270px',
            height: '400px',
            padding: '0 15px',
        });

        const footer = createIconsFooter(item, appConfigList, app);
        footer.setStyle({
            display: 'flex',
            justifyContent: 'space-between',
            background: '#ffffff29',
            width: '100%',
            padding: '2px',
            borderRadius: '50px',
            width: '100%',
        })


        const container = new ComponentStyled(document.createElement('div'), {
            display: 'flex',
            flexDirection: 'column',
            width: '270px',
            height: '450px',
            alignItems: 'center',
            gap: '5px',
        })

        container.append(app)
        container.append(footer)
        root.appendChild(container.element);
    });

    renderCard(root, appConfigList);
    
}

const closeLoading = () => {
    const loading = document.querySelector('#loading');
    loading.classList.remove('d-flex');
    loading.classList.add('d-none');
}

const showLoading = () => {
    const loading = document.querySelector('#loading');
    loading.classList.remove('d-none');
    loading.classList.add('d-flex');
}

let csrfToken = getCsrfTokenHead();

const main = async () => {
    
    const pagination = new Pagination();
    const appConfigList = new AppConfigList();

    const getConfigApp = async () => {
        appConfigList.clear();

        const offset = pagination.offset;
        const limit = pagination.limit;

        try {

            const response = await fetch(`/app_layout/list?offset=${offset}&limit=${limit}`, {
                headers: {}
            });

            const csrfTokenRefresh = getCsrfTokenRefresh(response);
            if (csrfTokenRefresh) csrfToken = csrfTokenRefresh;

            const data = await response.json();
            const items = data.data.result || data.data;

            pagination.offset = data.data.offset || 1;
            pagination.limit = data.data.limit || 25;
            pagination.total = data.data.total || items.length;
            pagination.render();

            items.forEach(item => appConfigList.add(AppConfig.fromJson(item)));
            renderApp(appConfigList);
            closeLoading();

        } catch (e) {
            const error = new InternalError(document.querySelector('.content'));
            error.render();
            return;
        }
    }

    await getConfigApp();

    pagination.root = document.querySelector('.content');
    pagination.mount();
    pagination.setOnPageChange(() => {
        showLoading();
        getConfigApp();
    });

    appConfigList.observe((event, data) => {
        renderApp(appConfigList);
    });

    appConfigList.observe(async (event, config) => {
        if (event == 'update') {

            // showToastInfo('Salvando configuração...');

            const data = config.toJson();
            const url = config.id ? `/app_config/store/update/${config.id}` : '';

            const response = await fetch('/app_layout/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            });

            if (response.status === 200) {
                showToastSuccess('Configuração salva com sucesso!');
                return;
            }

            const result = await response.json();
            if (result.message) {
                showToastError(result.message);
                return;
            }

            showToastError('Erro ao salvar configuração!');
        }
    });

    appConfigList.observe(async (event, config) => {
        if (event == 'delete') {

            //showToastInfo('Deletando configuração...');

            const response = await fetch(`/app_layout/delete/${config.id}`, {
                method: 'DELETE',
                headers: {}
            });
           
            if (response.status === 204) {
                showToastSuccess('Configuração deletada com sucesso!');
                main();
                return;
            }

            const result = await response.json();
            if (result.message) {
                showToastError(result.message);
                return;
            }
            
            showToastError('Erro ao deletar configuração!');
        }
    });

    appConfigList.observe(async (event, data) => {
        if (event == 'create') {

            //showToastInfo('Criando configuração...');

            const response = await fetch('/app_layout/create', {
                method: 'POST',
                headers: {}
            });

            if (response.status == 201) {
                showToastSuccess('Layout criado com sucesso!');
                main();
                return;
            }
            
            const result = await response.json();
            if (result.message) {
                showToastError(result.message);
                return;
            }

            showToastError('Erro ao criar layout!');
        }
    });

    appConfigList.observe(async (event, id) => {
        if (event == 'toggle') {

            // showToastInfo('Trocando configuração...');

            const response = await fetch(`/app_layout/toogle/${id}`, {
                method: 'PUT',
                headers: {}
            });

            if (response.status === 200) {
                showToastSuccess('Configuração trocada com sucesso!');
                main();
                return;
            }

            const result = await response.json();
            if (result.message) {
                showToastError(result.message);
                return;
            }

            showToastError('Erro ao trocar configuração!');
        }
    });

    appConfigList.observe(async (event, config) => {
        if (event == 'import') {

            // showToastInfo('Importando configuração...');

            const data = config.toJson();
            const response = await fetch('/app_layout/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            });

            main();
            
            if (response.status == 201) {
                showToastSuccess('Configuração importada com sucesso!');
                return;
            }

            const result = await response.json();
            if (result.error) {
                showToastSuccess(result.message);
                return;
            }

            showToastError('Erro ao importar configuração!');
        }
    });

    appConfigList.observe(async (event, config) => {
        if (event === 'sync') {
            // showToastInfo('Aguarde, sincronizando configuração...');
            let response = await fetch('/app_config/sync', { 'method': 'POST' });
            let result = await response.json();
            if (result.data && result.status != 201) {
                showToastError('Erro ao sincronizar configuração padrão!');
                return;
            }

            response = await fetch('/app_config/store/sync', { 'method': 'POST' });
            result = await response.json();
            if (result.data && result.status != 201) {
                showToastError('Erro ao sincronizar lista de configurações!');
                return;
            }

            showToastSuccess('Parabéns, configuração sincronizada com sucesso!');
            showLoading();
            getConfigApp();
        }
    });
}

main();