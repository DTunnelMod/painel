class UpdateModal {
    __html = `
        <div class="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-md-down">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Configurações</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-1 row">

                </div>
                <div class="modal-footer">
                    <div class="d-flex w-100 justify-content-between">
                        <button type="button" class="btn__close btn-responsive w-100 me-2" data-bs-dismiss="modal">Sair</button>
                        <button type="button" class="btn__save btn-responsive w-100">Salvar</button>
                    </div>
                </div>
            </div>
        </div>`

    constructor(items) {
        this.items = items;

        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');
        this._element.setAttribute('tabindex', '-1');
        this._element.setAttribute('data-bs-backdrop', 'static');
        this._element.innerHTML = this.__html;

        this._root = this._element.querySelector('.modal-body');
        this._root.innerHTML = '';
        this._root.append(...this.items.map(item => item.element));

        this.modal = new bootstrap.Modal(this._element);
    }

    setOnClickSave(callback) {
        this._element.querySelector('.btn__save').addEventListener('click', callback);
    }

    setOnClickCancel(callback) {
        this._element.querySelector('.btn__close').addEventListener('click', callback);
    }

    show() {
        this.modal.show();
    }

    onShow(callback) {
        this.modal._element.addEventListener('shown.bs.modal', callback);
    }

    hide() {
        this.modal.hide();
    }
}

export default UpdateModal;