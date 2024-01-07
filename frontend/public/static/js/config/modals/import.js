import Table, { TableItem } from '../components/table.js';
import { ConfigLoaderFactory } from '../configImport.js';
import ConfigModel from '../models.js';
import ModalConfigForm from '../modals/config.js'

class ConfigImportModal {
    __html = `
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">IMPORTAR CONFIGURAÇÃO</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="d-flex flex-column gap-3">
                    <div class="w-100">
                        <label class="form-label">CATEGORIA</label>
                        <select class="form-select"></select>
                    </div>
                    <div class="w-100">
                        <textarea class="form-control d-none" rows="10"></textarea>
                        <div class="w-100" id="table"></div>
                    </div>
                    <div class="d-flex gap-3">
                        <div class="w-100">
                            <label class="form-label">ARQUIVO</label>
                            <input type="file" class="form-control">
                        </div>
                        <div class="w-100">
                            <label class="form-label">LINK</label>
                            <input type="text" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="d-flex flex-fill justify-content-end gap-3">
                    <button type="button" class="btn btn-dark w-100" data-bs-dismiss="modal">Fechar</button>
                    <button type="submit" class="btn btn-dark w-100">Importar</button>
                </div>
            </div>
        </div>
    </div>
    `

    constructor(configList, categoryList, configImport) {
        this.configList = configList;
        this.categoryList = categoryList;
        this.configImport = configImport;

        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade')
        this._element.innerHTML = this.__html;

        this._textArea = this._element.querySelector('textarea');
        this._table = this._element.querySelector('#table');

        this.modal = new bootstrap.Modal(this._element);

        this.categorySelect = this._element.querySelector('select');
        this.onImportListener = null;

        this.categorySelect.onchange = e => this.setCategoryId(e.target.value)

        this._element.querySelector('input[type="text"]').onchange = e => {
            showToastInfo('Carregando configurações...')
            this.load('LINK', e.target.value);
        }

        this._element.querySelector('input[type="file"]').onchange = e => {
            showToastInfo('Carregando configurações...')
            this.load('FILE', e.target.files[0]);
        }

        this._element.querySelector('button[type="submit"]').onclick = () => this.import();

        this._textArea.onchange = () => {
            const items = JSON.parse(this._textArea.value);
            this.table.items = items.map(config => {
                config.id = 1000;
                const item = new TableItem(config);
                item.setOnClickEdit(() => {
                    const modal = new ModalConfigForm(config, categoryList.categories);
                    modal.setOnSaveListener(() => {
                        try {
                            modal.form.validate();
                            const data = modal.form.toConfig();
                            data.id = config.id
                            data.category = categoryList.get(data.category_id)
                            data.status = config.status

                            Object.assign(config, data);
                            this.setTextAreaValue(items)

                            modal.hide();
                        } catch (e) {
                            showToastError(e.message);
                        }
                    })
                    modal.show();
                });
                item.setOnClickDelete(() => showAlertConfirm(() => {
                    items.forEach((item, index, object) => {
                        if (item === config) {
                            object.splice(index, 1);
                            this.setTextAreaValue(items);
                        }
                    });
                }));
                item.setOnClickCopy(() => showAlertConfirm(() => {
                    const data = JSON.parse(JSON.stringify(config));
                    data.name = data.name + ' (COPY)'
                    items.push(data);
                    this.setTextAreaValue(items);
                }));
                item.setOnToggleStatus(() => {
                    config.status = config.status == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                    this.setTextAreaValue(items);
                })
                return item;
            });
            this.table.render()
            this._table.appendChild(this.table.element);
        }

        this.table = new Table();
    }

    setCategoryId(categoryId) {
        const data = JSON.parse(this._textArea.value);
        const items = Array.isArray(data) ? data : [data];

        items.forEach(item => {
            if (!categoryId) {
                delete item.category.id;
                delete item.category_id;
                return;
            }
            item.category = this.categoryList.get(parseInt(categoryId));
            item.category_id = parseInt(categoryId);
        });

        this.setTextAreaValue(items);
    }

    setOnImportListener(onImportListener) {
        this.onImportListener = onImportListener;
    }

    setTextAreaValue(value) {
        if (typeof value === 'string') {
            this._textArea.value = value;
        } else {
            this._textArea.value = JSON.stringify(value, null, 4)
        }

        this._textArea.dispatchEvent(new Event('change'));
    }

    async load(type, value) {
        try {
            const importer = ConfigLoaderFactory.create(type);
            this.setTextAreaValue(await importer.load(value));
        } catch (e) {
            showToastError(e.message);
        }
    }

    async import() {
        try {
            const configContent = this._textArea.value;
            if (!configContent || configContent === '') {
                showToastError('Não há configurações para importar!');
                return;
            }

            showToastInfo('Importando configurações...');

            const obj = JSON.parse(configContent)
            const items = (Array.isArray(obj) ? obj : [obj]).map(item => ConfigModel.fromJson(item));

            const content = JSON.stringify(items.map(item => JSON.parse(item.toJson())));
            await this.configImport.import(content);

            this?.onImportListener()

            showToastSuccess('Configurações importadas com sucesso!');
            this.modal.hide();
        } catch (e) {
            showToastError(e.message);
        }
    }

    show() {
        if (this.categoryList.categories.length === 0) {
            this.categorySelect.parentNode.classList.add('d-none');
        } else {
            this.renderCategorySelect();
        }
        this.modal.show();
    }

    renderCategorySelect() {
        this.categorySelect.innerHTML = '';
        const _default = document.createElement('option');
        _default.value = '';
        _default.innerText = 'Selecione uma categoria';
        this.categorySelect.appendChild(_default);

        this.categorySelect.parentNode.classList.remove('d-none');
        this.categoryList.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.innerText = category.name;
            this.categorySelect.appendChild(option);
        });
    }
}

export default ConfigImportModal;