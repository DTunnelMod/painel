import { setPickerColor } from '../../picker.js'

class CategoryModal {
    constructor(form) {
        this.form = form
        this.element = document.createElement('div')
        this.element.classList.add('modal-dialog', 'modal-dialog-centered')
        this.element.setAttribute('role', 'document')
        this.element.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Categoria</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer d-flex justify-content-between flex-nowrap">
                    <button type="button" class="btn-responsive w-100 me-2" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn-responsive w-100">Salvar</button>
                </div>
            </div>
        `
    }

    setOnSave(fn) {
        const button = this.element.querySelector('.modal-footer button:last-child')
        button.addEventListener('click', fn)
    }

    show() {
        this._root = document.createElement('div')
        this._root.classList.add('modal', 'fade')
        this._root.setAttribute('tabindex', '-1')

        this.element.querySelector('.modal-body').appendChild(this.form.render())
        this._root.appendChild(this.element)

        this.modal = new bootstrap.Modal(this._root)
        this.modal.show()
    }

    hide() {
        if (this.modal) this.modal.hide()
    }
}

class CategoryForm {
    __html = `
        <div class="mb-3 row">
            <div class="col-md-6">
                <label class="form-label">Nome</label>
                <input type="text" class="__name form-control" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Ordem</label>
                <input type="number" class="__order form-control" required>
            </div> 
        </div>
        <div class="mb-3 row">
            <div class="col-md-6">
                <label class="form-label">Cor</label>
                <input type="text" class="__color form-control" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Status</label>
                <select class="__status form-select">
                    <option value="ACTIVE">ATIVO</option>
                    <option value="INACTIVE">INATIVO</option>
                </select>
            </div>
        </div>
        `

    constructor(category) {
        this.category = category

        this.element = document.createElement('form')
        this.element.classList.add('form-group')
        this.element.innerHTML = this.__html

        this.name = this.element.querySelector('.__name')
        this.order = this.element.querySelector('.__order')

        this.color = this.element.querySelector('.__color')
        setPickerColor(this.color, this.category.color, color => {
            this.category.color = color
            this.color.value = this.category.color
        })

        this.status = this.element.querySelector('.__status')
        this.setup()
    }

    setupColorPicker() {
        const colorPicker = new jscolor(this.color)
        colorPicker.onInput = () => {
            this.category.color = colorPicker.toHEXAString();
            this.color.value = this.category.color
        }
        colorPicker.alphaChannel = true;
        colorPicker.alpha = 0.5;
        colorPicker.fromString(this.category.color)
    }

    setup() {
        this.name.addEventListener('input', e => {
            this.category.name = e.target.value
        })

        this.order.addEventListener('input', e => {
            this.category.sorter = e.target.value
        })

        this.color.addEventListener('input', e => {
            this.category.color = e.target.value
        })

        this.status.addEventListener('input', e => {
            this.category.status = e.target.value
        })
    }

    validate() {
        if (this.element.checkValidity()) return true
        this.element.classList.add('was-validated')
    }

    render() {
        this.name.value
        this.name.value = this.category.name
        this.order.value = this.category.sorter
        this.color.value = this.category.color
        this.status.value = this.category.status
        return this.element
    }
}


export { CategoryModal, CategoryForm }