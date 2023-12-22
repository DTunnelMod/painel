class ConfigAppExportFile {
    constructor(config) {
        this.config = config;
    }

    async export() {
        const blob = new Blob([this.config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'app_config.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

class ConfigAppExportUrl {
    constructor(config) {
        this.config = config;
    }

    async export() {
        const form = new FormData();
        form.append('file', new File(
            [this.config],
            'config.json', {
            type: 'application/json'
        }));

        const response = await fetch('/config/upload/file', {
            method: 'POST',
            body: form
        });
        const result = await response.json();
        if (result.status != 200)
            throw new Error();
        return result.data;
    }
}

class ConfigAppExportFactory {
    static create(type, config) {
        switch (type) {
            case 'FILE':
                return new ConfigAppExportFile(config);
            case 'LINK':
                return new ConfigAppExportUrl(config);
        }
    }
}

const convertConfigToExport = (config) => {
    const items = JSON.parse(
        JSON.stringify(
            config.items.map(item => item.toJson())
        )
    );
    items.forEach(item => {
        delete item.id;
        delete item.user_id;
    });
    return JSON.stringify(items, null, 4);
}

class AppConfigExportModal {
    __html = `
    <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="showModalChooseExportOrPasteLabel">Exporta configuração</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <textarea class="form-control mb-3 d-none" rows="10"></textarea>
                <div class="__preview d-flex align-items-center justify-content-center mb-3"></div>
                <div class="__items mb-3" style="display: none;">
                    <div class="d-flex flex-column w-100 gap-3">
                        <div class="w-auto">
                            <label class="form-label">Link dos dados</label>
                            <div class="input-group">
                                <input type="text" class="form-control __link" readonly>
                                <button class="btn btn-dark btn__copy__link" type="button">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                        <div class="w-auto">
                            <label class="form-label">Link de pré-visualização</label>
                            <div class="input-group">
                                <input type="text" class="form-control __share" readonly>
                                <button class="btn btn-dark btn__copy__share" type="button">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="__spinner justify-content-center p-3 d-none">
                    <div class="spinner-border p-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-dark w-100 me-3" data-type="FILE">ARQUIVO</button>
                    <button type="button" class="btn btn-dark w-100" data-type="LINK" disabled>LINK</button>
                </div>
            </div>
        </div>
    </div>
    `

    constructor(config, app) {
        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');
        this._element.setAttribute('tabindex', '-1');
        this._element.innerHTML = this.__html;

        this._root = this._element.querySelector('.modal-body');
        this._root.querySelector('textarea').value = convertConfigToExport(config);

        this.modal = new bootstrap.Modal(this._element);
        this._root.querySelector('button[data-type="LINK"]').addEventListener('click', () => this.export('LINK'));
        this._root.querySelector('button[data-type="FILE"]').addEventListener('click', () => this.export('FILE'));

        this._root.querySelector('.btn__copy__link').addEventListener('click', () => this.copy(this._root.querySelector('.__link').value));
        this._root.querySelector('.btn__copy__share').addEventListener('click', () => this.copy(this._root.querySelector('.__share').value));

        this._preview = this._root.querySelector('.__preview');
        this._preview.appendChild(app.element);
    }

    copy(data) {
        navigator.clipboard.writeText(data);
        showToastSuccess('Copiado com sucesso!');
    }

    showLoading() {
        this._root.querySelector('.__spinner').classList.remove('d-none');
        this._root.querySelector('.__spinner').classList.add('d-flex');
    }

    hideLoading() {
        this._root.querySelector('.__spinner').classList.add('d-none');
        this._root.querySelector('.__spinner').classList.remove('d-flex');
    }

    async export(type) {
        showToastInfo('Exportando configuração...');
        this.showLoading();

        const config = this._root.querySelector('textarea').value;
        const exportConfig = ConfigAppExportFactory.create(type, config);
        const result = await exportConfig.export();

        if (result) {
            this._root.querySelector('.__items').style.display = 'flex';
            this._root.querySelector('.__link').value = result;
            this._root.querySelector('.__share').value = window.location.origin + '/app/render?url=' + result;
        }

        this.hideLoading();
        showToastSuccess('Configuração exportada com sucesso!');
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }
}

export default AppConfigExportModal;