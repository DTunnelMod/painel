class AppCustomModal {
    __html = `
    <div class="modal-dialog modal-md modal-fullscreen-md-down d-flex align-items-center justify-content-center">
        <div class="modal-content app-modal-content">
            <div class="modal-body position-absolute w-100 h-100 p-0">
            </div>
        </div>
    </div>`

    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');
        this._element.setAttribute('tabindex', '-1');
        this._element.innerHTML = this.__html;

        this._root = this._element.querySelector('.modal-body');
        this.modal = new bootstrap.Modal(this._element);
    }

    setApp(app) {
        this._root.innerHTML = '';
        this._root.append(app.element);
    }

    setFooter(footer) {
        this._root.append(footer.element);
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }
}

export default AppCustomModal;