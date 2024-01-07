import { Component } from "./core/base.js";
import { setPickerColor } from '../../picker.js';
import CodeEditorModal from "../modals/code.js";

class Column extends Component {
    constructor(component) {
        super(document.createElement('div'));
        this.element.classList.add('col-md-4', 'mb-4');
        if (component) {
            this.append(component);
        }
    }
}

class Card extends Component {
    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('card', 'shadow', 'border-0', 'card-small');
        this.element.style.minHeight = '13rem';
    }
}

class Input extends Card {
    __html = `
    <div class="card-body p-2 pb-0 mt-2">
        <h6 class="card-title">
            <span class="text-fiord-blue"></span>
        </h6>
    </div>`

    constructor(config) {
        super();
        this.element.innerHTML = this.__html;
        this.title = this.element.querySelector('.text-fiord-blue');
        this.title.innerText = config.label;
    }

    appendInput(html) {
        this.element.querySelector('.card-body').innerHTML += html;
    }
}

class InputString extends Input {
    __html = `
        <div class="input-group mb-3">
            <input type="text" class="form-control">
            <button class="input-group-text" type="button">
                <i class="bi bi-trash"></i>
            </button>
        </div>`

    constructor(config) {
        super(config);
        this.appendInput(this.__html);
        this.input = this.element.querySelector('input');
        this.button = this.element.querySelector('button');

        this.input.value = config.value;
        this.button.addEventListener('click', () => {
            this.input.value = '';
            this.input.dispatchEvent(new Event('input'));
        });
    }

    setOnChange(callback) {
        this.input.addEventListener('input', e => callback(this.input.value));
    }
}

class InputNumber extends Input {
    __html = `
        <div class="input-group mb-3">
            <input type="number" class="form-control">
            <button class="input-group-text" type="button">
                <i class="bi bi-trash"></i>
            </button>
        </div>`
    constructor(config) {
        super(config);
        this.appendInput(this.__html);
        this.input = this.element.querySelector('input');
        this.button = this.element.querySelector('button');

        this.input.value = config.value;
        this.button.addEventListener('click', () => {
            this.input.value = 0;
            this.input.dispatchEvent(new Event('input'));
        });
    }

    setOnChange(callback) {
        this.input.addEventListener('input', e => callback(this.input.value));
    }
}

class InputText extends Input {
    __html = `
        <textarea class="form-control" aria-label="With textarea" rows="4"></textarea>
        <button class="input-group-text btn btn-dark w-100 mt-2" type="button">
            <i class="bi bi-trash"></i>
        </button>
        `

    constructor(config) {
        super(config);
        this.appendInput(this.__html);
        this.textarea = this.element.querySelector('textarea');
        this.button = this.element.querySelector('button');
        this.textarea.value = config.value;
        this.button.addEventListener('click', () => {
            this.textarea.value = '';
            this.textarea.dispatchEvent(new Event('input'));
        });
    }

    setOnChange(callback) {
        this.textarea.addEventListener('input', e => callback(this.textarea.value));
    }
}

class InputColor extends Input {
    __html = `
        <div class="mb-3">
            <span class="badge rounded-pill mb-1 w-100"></span>
            <input type="text" class="form-control mb-1" />
        </div>`

    constructor(config) {
        super(config);
        this.appendInput(this.__html);
        this.input = this.element.querySelector('input');
        this.input.value = config.value;

        const span = this.element.querySelector('.badge');
        span.style.backgroundColor = config.value;
        span.style.border = '1px solid #000';
        span.innerText = config.value;

        setPickerColor(this.input, config.value, (color) => {
            span.style.backgroundColor = color;
            span.innerText = color;
            this.input.value = color;
        });

        span.addEventListener('click', () => {
            this.input.jscolor.show();
        });

        this.element.querySelector('input').addEventListener('input', (event) => {
            span.style.backgroundColor = event.target.value;
            span.innerText = event.target.value;
        });
    }

    setOnChange(callback) {
        this.element.querySelector('input').addEventListener('input', e => callback(e.target.value));
    }
}

class InputImage extends Input {
    __html = `
        <input type="file" style="display: none">
        <div class="input-group mb-3">
            <input type="text" class="form-control">
            <button class="input-group-text btn__clear">
                <i class="bi bi-trash"></i>
            </button>
            <button class="input-group-text btn__upload" type="button">
                <i class="bi bi-upload"></i>
            </button>
        </div>
        <img style="height: 6rem" class="img-fluid mx-auto d-block">`

    constructor(config) {
        super(config);
        this.appendInput(this.__html);
        this.element.querySelector('.text-fiord-blue').innerText = config.label;
        this.btnUpload = this.element.querySelector('.btn__upload');
        this.btnClear = this.element.querySelector('.btn__clear');
        this.inputUrl = this.element.querySelector('input[type="text"]');
        this.inputFile = this.element.querySelector('input[type="file"]');
        this.img = this.element.querySelector('img');

        if (config.value) {
            this.inputUrl.value = config.value;
            this.img.src = config.value;
        }

        this.inputFile.addEventListener('change', async (event) => {
            const element = event.target;
            const url = await uploadImage(element);
            this.inputUrl.value = url;
            this.inputUrl.dispatchEvent(new Event('input'));
        });

        this.btnUpload.addEventListener('click', () => this.inputFile.click());
        this.inputUrl.addEventListener('input', event => this.img.src = event.target.value);
        this.btnClear.addEventListener('click', () => {
            this.inputUrl.value = '';
            this.inputUrl.dispatchEvent(new Event('input'));
        });
    }

    setOnChange(callback) {
        this.inputUrl.addEventListener('input', e => callback(this.inputUrl.value));
    }
}

class InputBoolean extends Input {
    __html = `
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox">
            <label class="form-check-label mt-1 ms-1"></label>
        </div>`

    constructor(config) {
        super(config);
        this.appendInput(this.__html);

        this.input = this.element.querySelector('input');
        this.label = this.element.querySelector('label');

        this.input.checked = config.value;
        this.label.innerText = config.value ? 'SIM' : 'NÃO';

        this.validator = () => { };
        this.onchange = () => { };

        this.input.onchange = e => {
            const checked = e.target.checked;
            try {
                this.validator(checked);
                this.onchange(checked);
                this.label.innerText = checked ? 'SIM' : 'NÃO';
            } catch (e) {
                this.input.checked = !checked;
                showToastError(e.message);
            }
        };
    }

    setValidator(validator) {
        this.validator = validator;
    }

    setOnChange(callback) {
        this.onchange = callback;
    }
}

class InputSelect extends Input {
    __html = `
        <select class="form-select">
        </select>`

    constructor(config) {
        super(config);
        this.appendInput(this.__html);
        this.select = this.element.querySelector('select');

        config.value.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.innerText = option.label;
            this.select.appendChild(optionElement);
        });

        this.select.value = config.value.selected;
    }

    setOnChange(callback) {
        this.select.addEventListener('change', e => callback(this.select.value));
    }
}

class InputUrl extends Input {
    __html = `
        <div class="input-group mb-3">
            <input type="url" class="form-control">
            <button class="input-group-text btn__clear">
                <i class="bi bi-trash"></i>
            </button>
        </div>`

    constructor(config) {
        super(config);
        this.appendInput(this.__html);

        this.input = this.element.querySelector('input');
        this.btnClear = this.element.querySelector('.btn__clear');

        this.input.value = config.value;
        this.btnClear.addEventListener('click', () => {
            this.input.value = '';
            this.input.dispatchEvent(new Event('input'));
        });
    }

    setOnChange(callback) {
        this.input.addEventListener('input', e => callback(this.input.value));
    }
}

class InputHtml extends Input {
    __html = `
        <textarea class="form-control" rows="4"></textarea>
        <div class="d-flex">
            <button class="btn btn-dark btn__clear w-100 mt-2">
                <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-dark btn__view w-100 mt-2 ms-2">
                <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-dark btn__editor w-100 mt-2 ms-2">
                <i class="bi bi-code-slash"></i>
            </button>
            <button class="btn btn-dark btn__import w-100 mt-2 ms-2">
                <i class="bi bi-upload"></i>
            </button>
        </div>
        `

    constructor(config) {
        super(config);
        this.appendInput(this.__html);

        this.modalCodeEditor = CodeEditorModal.create(config);;

        this.textarea = this.element.querySelector('textarea');
        this.btnClear = this.element.querySelector('.btn__clear');
        this.btnView = this.element.querySelector('.btn__view');
        this.btnEditor = this.element.querySelector('.btn__editor');
        this.btnImport = this.element.querySelector('.btn__import');

        this.elementModalView = document.createElement('div');
        this.elementModalView.classList.add('modal', 'fade')

        this.textarea.value = config.value;

        this.configureClear();
        this.configureButtonView(config.label);
        this.configureButtonEditor();
        this.configureButtonImport();
    }

    setOnChange(callback) {
        this.textarea.addEventListener('input', e => callback(this.textarea.value));
    }

    setValue(value) {
        this.textarea.value = value;
        this.textarea.dispatchEvent(new Event('input'))
    }

    configureClear() {
        this.btnClear.addEventListener('click', () => {
            this.setValue('')
            showToastSuccess('Dados apagados com sucesso.')
        });
    }

    configureIframe() {
        const blob = new Blob([this.textarea.value], { type: 'text/html' });
        const iframe = this.elementModalView.querySelector('iframe');
        iframe.src = URL.createObjectURL(blob);
    }

    configureButtonView(label) {
        this.elementModalView.innerHTML = `
            <div class="modal-dialog modal-xl modal-fullscreen-sm-down modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-6">${label}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body ratio p-0" style="height: 768px">
                        <iframe class="rounded-bottom w-100 h-100"></iframe>
                    </div>
                </div>
            </div>`;

        const modal = new bootstrap.Modal(this.elementModalView);

        this.btnView.addEventListener('click', () => {
            if (this.textarea.value) {
                this.configureIframe();
                modal.show()
            }
        });
    }

    configureButtonEditor() {
        this.btnEditor.addEventListener('click', () => {
            this.modalCodeEditor.show();
        });
    }

    configureButtonImport() {
        this.btnImport.addEventListener('click', () => {
            const fileElement = document.createElement('input')
            fileElement.type = 'file'
            fileElement.addEventListener('change', e => {
                const reader = new FileReader()
                reader.onload = event => {
                    this.setValue(event.target.result)
                    showToastSuccess('Arquivo importado com sucesso.')
                };
                reader.onloadend = () => fileElement.remove();
                reader.readAsText(e.target.files[0], 'utf-8')
            })
            fileElement.click()
        })
    }
}

class AppConfigForm extends Component {
    constructor() {
        super(document.createElement('form'));
        this.element.classList.add('app-config-form');
    }
}

export {
    Column, InputString, InputText, InputColor, AppConfigForm,
    InputImage, InputBoolean, InputSelect, InputUrl, InputHtml,
    InputNumber
};