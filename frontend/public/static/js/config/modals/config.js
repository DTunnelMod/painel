import { ConfigFormFactory } from "../components/form.js";

export default class ModalConfigForm {
    __html = `
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">CONFIGURAÇÃO</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                    <div id="root"></div>
                </div>
                <div class="modal-footer">
                    <div class="d-flex w-100 justify-content-between">
                        <button type="button" class="btn-responsive me-1 w-100" data-bs-dismiss="modal">Fechar</button>
                        <button class="btn-responsive btn-primary w-100">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    `
    constructor(config, categories) {
        this.form = ConfigFormFactory.create(config.mode, config, categories)
        this.mode = this.form.mode;

        this._element = document.createElement('div')
        this._element.classList.add('modal', 'fade')
        this._element.innerHTML = this.__html
        this._element.addEventListener('hide.bs.modal', () => this._element.remove());

        this.modal = new bootstrap.Modal(this._element)

        this._mode = this._element.querySelector('#type')
        this._root = this._element.querySelector('#root')

        this.renderForm();
        this.configureMode(config, categories);
    }

    renderForm() {
        this._root.innerHTML = ''
        this._root.appendChild(this.form.render())
    }

    configureMode(config, categories) {
        this.mode.setOnChange(() => {
            config.mode = this.mode.getSelected().value;

            this.form = ConfigFormFactory.create(config.mode, config, categories)
            this.mode = this.form.mode;

            this.renderForm();
            this.configureMode(config, categories);
        })
    }

    setOnSaveListener(callback) {
        const button = this._element.querySelector('.modal-footer > div').childNodes[3]
        button.onclick = callback
    }

    show() {
        this.modal.show()
    }

    hide() {
        this.modal.hide()
    }
}