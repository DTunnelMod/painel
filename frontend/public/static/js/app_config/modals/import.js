import AppConfigView from "../components/app.js";
import AppConfig from "../models.js";

class AppConfigImportFile {
    async load(file) {
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.onerror = (e) => {
                reject(e);
            };
            reader.readAsText(file);
        });
        return promise;
    }
}

class AppConfigImportUrl {
    async load(url) {
        const data = await fetch(url);
        return data.text();
    }
}

class AppConfigImportFactory {
    static create(type) {
        if (type === 'URL') {
            return new AppConfigImportUrl();
        }
        if (type === 'FILE') {
            return new AppConfigImportFile();
        }
    }
}

class AppConfigImportModal {
    __html = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Importar configurações</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <textarea class="form-control mb-3 d-none" rows="10"></textarea>
                    <div class="__spinner d-none p-5">
                        <div class="spinner-border text-dark p-3" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div class="__preview d-flex align-items-center justify-content-center"></div>
                    <div class="mb-3">
                        <label for="import-url" class="form-label">URL</label>
                        <input type="text" class="form-control" id="import-url">
                    </div>
                    <div class="mb-3">
                        <label for="import-file" class="form-label">AQUIVO</label>
                        <input class="form-control" type="file" id="import-file">
                    </div>
                </div>
                <div class="modal-footer d-flex flex-nowrap">
                    <button type="button" class="btn btn-dark w-100 me-2" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-dark w-100 btn__import">Importar</button>
                </div>
            </div>
        </div>`

    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('modal', 'fade');
        this.element.setAttribute('tabindex', '-1');
        this.element.innerHTML = this.__html;

        this.element.querySelector('.btn__import').addEventListener('click', this.__onImportClick.bind(this));
        this.element.querySelector('#import-file').addEventListener('change', this.__onFileChange.bind(this));
        this.element.querySelector('#import-url').addEventListener('input', this.__onUrlChange.bind(this));

        this.spinner = this.element.querySelector('.__spinner');

        this.modal = new bootstrap.Modal(this.element);
        this.textarea = this.element.querySelector('textarea');
        this.preview = this.element.querySelector('.__preview');

        this.callbackOnImport = null;
    }

    showPreview(config) {
        try {
            const app = new AppConfigView(AppConfig.fromJson({
                id: null,
                app_config: JSON.parse(config)
            }), {
                maxWidth: '270px',
                height: '400px',
                padding: '0 15px',
            });
            this.preview.innerHTML = '';
            this.preview.appendChild(app.element);
        } catch (e) {
            showToastError('Configurações inválidas!')
        };
    }

    showSpinner() {
        this.spinner.classList.remove('d-none');
        this.spinner.classList.add('d-flex', 'justify-content-center', 'align-items-center');
        this.preview.innerHTML = '';
    }

    hideSpinner() {
        this.spinner.classList.add('d-none');
        this.textarea.style.display = 'block';
    }

    setContent(content) {
        this.textarea.value = content;
    }

    setCallbackOnImport(callback) {
        this.callbackOnImport = callback;
    }

    __onImportClick() {
        const text = this.element.querySelector('textarea').value;

        if (!text) {
            showToastError('Nenhuma configuração foi importada.');
            return;
        }

        try {
            const config = JSON.parse(text);
            this.callbackOnImport(config);
        } catch (e) {
            showToastError('Não foi possível importar configuração');
            return;
        }
    }

    __onFileChange(e) {
        this.showSpinner();
        const file = e.target.files[0];
        const importFile = AppConfigImportFactory.create('FILE');
        importFile.load(file).then(text => {
            this.hideSpinner();
            this.setContent(text);
            this.showPreview(text);
        });
    }

    __onUrlChange(e) {
        this.showSpinner();
        const url = e.target.value;
        const importUrl = AppConfigImportFactory.create('URL');
        importUrl.load(url).then(text => {
            this.hideSpinner();
            this.setContent(text);
            this.showPreview(text);
        });
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }
}

export default AppConfigImportModal;