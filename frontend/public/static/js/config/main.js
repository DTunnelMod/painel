import { Observer } from './observer.js';
import ConfigModel, { CategoryList, CategoryModel, ConfigList, Status } from './models.js';
import Table, { TableItem } from './components/table.js';
import Pagination from "../common/pagination.js";
import Search from './components/search.js';
import ConfigStatus from './components/status.js';
import ExportConfigModal from './modals/export.js';
import ConfigImportModal from './modals/import.js';
import ModalConfigForm from './modals/config.js';
import NotesUpdateModal from './modals/update.js';

import { ConfigImport } from './configImport.js';
import { InternalError } from '../common/errors.js';

const root = document.querySelector('#root');
const table = new Table();
const list = new ConfigList();
const categories = new CategoryList();
const pagination = new Pagination(document.querySelector('#pagination'));
const search = new Search(document.querySelector('.search-config'));
const status = new ConfigStatus(document.querySelector('.config-status'), [
    { value: Status.ACTIVE, text: 'ATIVO' },
    { value: Status.INACTIVE, text: 'INATIVO' },
    { value: 'ALL', text: 'TODOS' },
], Status.ACTIVE);

pagination.setOnPageChange(() => getConfigAndCategory().then(renderApp));
search.setOnSearch(() => getConfigAndCategory().then(renderApp));
status.setOnChange(() => getConfigAndCategory().then(renderApp));

let csrfToken = getCsrfTokenHead();

const initApp = async () => {
    pagination.render();
    search.render();
    status.render();
    await getConfigAndCategory();
    renderApp();
};

document.querySelector('.create-config').onclick = () => {
    if (categories.categories.length <= 0) {
        showToastError('Não foram encontradas categorias.');
        return;
    }

    const modal = new ModalConfigForm({ mode: 'SSH_DIRECT' }, categories.categories);
    modal.setOnSaveListener(() => {
        try {
            modal.form.validate();

            const config = modal.form.toConfig();
            config.status = 'ACTIVE';
            config.category = categories.get(config.category_id);

            list.append(config);
            modal.hide();
        } catch (e) {
            showToastError(e.message);
        }
    });
    modal.show();
};

document.querySelector('.delete-config').onclick = () => {
    const items = table.getCheckedItems();
    if (items.length <= 0) {
        showToastError('Selecione pelo menos uma configuração.');
        return;
    }

    showAlertConfirm(() => {
        items.forEach(item => {
            list.remove(item.config.id);
        });
    });
};

document.querySelector('.export-config').onclick = () => {
    const items = table.getCheckedItems();
    if (items.length <= 0) {
        showToastError('Selecione pelo menos uma configuração.');
        return;
    }

    const modal = new ExportConfigModal(items.map(item => item.config));
    modal.show();
};

document.querySelector('.import-config').onclick = () => {
    const modal = new ConfigImportModal(list, categories, ConfigImport.create());
    modal.setOnImportListener(async () => {
        await getConfigAndCategory();
        renderApp();
    });
    modal.show();
};

document.querySelector('.release-update').onclick = () => {
    const modal = new NotesUpdateModal();
    modal.show();
};

const renderApp = () => {
    list.sort();

    const items = list.getItemsByStatus(status.value);
    table.items = items.map(config => {
        const item = new TableItem(config);
        item.setOnClickEdit(() => {
            const modal = new ModalConfigForm(config, categories.categories);
            modal.setOnSaveListener(() => {
                try {
                    modal.form.validate();

                    const data = modal.form.toConfig();
                    data.id = config.id;
                    data.category = categories.get(config.category_id);
                    data.status = config.status;

                    list.update(data);
                    modal.hide();
                } catch (e) {
                    showToastError(e.message);
                }
            });
            modal.show();
        });
        item.setOnClickDelete(() => showAlertConfirm(() => list.remove(config.id)));
        item.setOnClickCopy(() => showAlertConfirm(() => list.duplicate(config.id)));
        item.setOnToggleStatus(() => list.toggleStatus(config.id));
        item.setOnOrderUp(() => {
            config.sorter -= 1;
            list.update(config);
        });
        item.setOnOrderDown(() => {
            config.sorter += 1;
            list.update(config);
        });
        return item;
    });

    table.render();
    root.innerHTML = '';
    root.appendChild(table.element);
};

const getConfigAndCategory = async () => {
    startLoader();

    const offset = pagination.offset ? pagination.offset : 1;
    const limit = pagination.limit ? pagination.limit : 10;
    const _search = search.query ? search.query : '';
    const _status = status.value && status.value !== 'ALL' ? status.value : '';

    try {

        const categoryList = await fetch('/category_list', {
            headers: {}
        });

        let csrfTokenRefresh = getCsrfTokenRefresh(categoryList);
        if (csrfTokenRefresh) csrfToken = csrfTokenRefresh;

        const categoryResponse = await categoryList.json();

        const configList = await fetch(`/configs_list?offset=${offset}&limit=${limit}&search=${_search}&status=${_status}`, {
            headers: {}
        });

        const configResponse = await configList.json();

        list.items = configResponse.data.result.map(item => ConfigModel.fromJson(item));

        pagination.offset = configResponse.data.offset;
        pagination.limit = configResponse.data.limit;
        pagination.total = configResponse.data.total;

        pagination.mount();

        const categoriesModels = categoryResponse.data.result.map(item => CategoryModel.fromJson(item));
        categoriesModels.forEach(item => categories.sync(item, list.items));
        
    } catch (error) {
        const errorElement = new InternalError(document.querySelector('.card'));
        errorElement.render();
        showToastError('Erro interno.');
    }
};

list.register(new Observer('append', async item => {

    categories.sync(item.category, list.items);

    try {

        const response = await fetch('/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: item.toJson()
        });

        const data = await response.json();

        if (response.status == 201) {
            item.id = data.config_id;
            showToastSuccess('Configuração criada com sucesso!');
            renderApp();
            return;
        }
        
        if (data.error) {
            showToastError(data.message);
            list.remove(item.id);
            categories.remove(item.id);
            return;
        }

    } catch (err) {
        showToastError('Não foi possível criar a configuração!');
        list.remove(item.id);
        categories.remove(item.id);
    }

    renderApp();
}));

list.register(new Observer('update', async item => {

    categories.sync(item.category, list.items);

    try {

        const response = await fetch(`/config/${item.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: item.toJson()
        });

        const csrfTokenRefresh = getCsrfTokenRefresh(response);
        if (csrfTokenRefresh) csrfToken = csrfTokenRefresh;

        if (response.status === 200) {
            showToastSuccess('Configuração atualizada com sucesso!');
            return;
        }

        const result = await response.json();
        if (result.error) {
            showToastError(data.message);
            return;
        }

    } catch (err) {
        showToastError('Não foi possível atualizar configuração!');
    } finally {
        renderApp();
    }
}));

list.register(new Observer('remove', async id => {
    categories.remove(id);
    try {

        const response = await fetch(`/config/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status == 204) {
            showToastSuccess('Configuração removida com sucesso!');
            return;
        }

        const data = await response.json();
        showToastError(data.message);
        return;
            
    } catch (err) {
        showToastError('Não foi possível remover a configuração!');
    } finally {
        renderApp();
    }
}));

categories.register(new Observer('append', category => {
    renderApp();
    configForm.renderCategoryOptions();
}));

initApp();
