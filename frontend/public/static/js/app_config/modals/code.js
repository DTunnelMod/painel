export default class CodeEditorModal {
    __html = `
    <div class="modal-dialog modal-xl modal-fullscreen-sm-down modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0">
                <h1 class="modal-title fs-6">EDITOR DE CODIGO</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0 d-flex w-100" style="height: 768px">
                <div class="spinner bg-dark d-flex w-100 h-100 justify-content-center align-items-center position-absolute">
                    <div class="spinner-border p-5" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div class="rounded-bottom h-100 code-editor"></div>
                <iframe class="bg-dark d-none d-md-block w-100 code-preview"></iframe>
            </div>
            <div class="modal-footer d-md-none p-1 border-0">
                <div class="d-flex w-100 justify-content-between">
                    <button type="button" class="btn-responsive w-100 me-2" data-bs-dismiss="modal">Sair</button>
                    <button type="button" class="btn-responsive w-100 view">Resultado</button>
                </div>
            </div>
        </div>
    </div>`

    constructor(config) {
        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');
        this._element.setAttribute('tabindex', '-1');
        this._element.innerHTML = this.__html;

        this._root = this._element.querySelector('.modal-body');
        this.modal = new bootstrap.Modal(this._element);
        this.editorInitialized = false;

        const iframe = this._element.querySelector('.code-preview')
        const setContentPreview = code => {
            const blob = new Blob([code], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            iframe.src = url;
        }

        this._element.addEventListener('shown.bs.modal', () => {
            if (!this.editorInitialized) {
                createEditor({
                    element: this._element.querySelector('.code-editor'),
                    value: config.value ?? '',
                    onchange: code => {
                        setContentPreview(code)
                        config.value = code
                    },
                    onload: () => {
                        this._element.querySelector('.spinner').remove();
                        this.editorInitialized = true
                    }
                });
                setContentPreview(config.value ?? '')
            }
        })

        const btnView = this._element.querySelector('.view');
        btnView.onclick = () => {
            iframe.classList.toggle('position-absolute');
            iframe.classList.toggle('h-100');
            iframe.classList.toggle('d-none');
        };
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }

    static create(config) {
        return config != null ? new CodeEditorModal(config) : null;
    }
}