class Dialog {
    constructor() {
        this.element = document.createElement('div');
        this.header = document.createElement('div');

        this.btnClose = document.createElement('button');
        this.btnCloseIcon = document.createElement('i');
        this.btnCloseIcon.classList.add('bi', 'bi-x-lg');
        this.btnClose.appendChild(this.btnCloseIcon);

        this.title = document.createElement('span');

        this.setStyle();
        this.buildHeader();
        this.setTitleText('DTunnel');

        this.element.addEventListener('click', e => e.stopPropagation());
    }

    setStyle() {
        const style = {
            height: 'auto',
            marginTop: '10px',
            background: '#212529',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '2px 2px',
            zIndex: '1057',
            position: 'fixed',
        };
        Object.entries(style).forEach(([key, value]) => {
            this.element.style[key] = value;
        });
    }

    buildHeader() {
        this.header.style.width = '100%';
        this.header.style.display = 'flex';
        this.header.style.justifyContent = 'space-between';
        this.header.style.fontFamily = 'sans-serif';

        this.title.style.color = '#fff';
        this.title.style.fontSize = '18px';
        this.title.style.fontWeight = 'bold';
        this.title.innerText = this.titleText;
        this.title.style.margin = '5px 10px';

        this.btnClose.style.width = '35px';
        this.btnClose.style.height = '35px';
        this.btnClose.style.display = 'flex';
        this.btnClose.style.justifyContent = 'center';
        this.btnClose.style.alignItems = 'center';
        this.btnClose.style.border = 'none';
        this.btnClose.style.cursor = 'pointer';
        this.btnClose.style.background = 'transparent';

        this.btnCloseIcon.style.color = '#fff';
        this.btnCloseIcon.style.fontSize = '20px';
        this.btnCloseIcon.style.cursor = 'pointer';

        this.btnClose.addEventListener('click', () => this.close());

        this.header.appendChild(this.title);
        this.header.appendChild(this.btnClose);
        this.element.appendChild(this.header);
    }

    setTitleText(text) {
        this.title.innerHTML = text;
    }

    close() {
        this.element.remove();
    }
}

class ColorPicker {
    constructor(options) {
        this.element = document.createElement('div');

        this.element.style.width = '100%';
        this.element.style.display = 'flex';
        this.element.style.justifyContent = 'center';

        this.options = options;
        this.picker = new iro.ColorPicker(this.element, this.options);
        this.onColorChange = null;
    }

    setColor(color) {
        this.picker.color.hexString = color;
        if (this.onColorChange) this.onColorChange(color);
    }

    setOnColorChange(fn) {
        this.onColorChange = fn;
        this.picker.on('color:change', (color) => {
            this.onColorChange(color.hex8String);
        });
    }
}

class Radius {
    constructor(start = 0, current = 0, end = 25) {
        this.element = document.createElement('input');
        this.start = start || 0;
        this.current = current || 0;
        this.end = end || 25;
        this.init();
    }

    init() {
        this.element.type = 'range';
        this.element.min = this.start;
        this.element.max = this.end;
        this.element.value = this.current;
        this.element.style.width = '100%';
        this.element.classList.add('form-range', 'px-2', 'py-1');
    }

    setOnRadiusChange(fn) {
        this.element.addEventListener('input', (e) => {
            fn(e.target.value);
        });
    }

    setRadius(value) {
        this.element.value = value;
        this.element.dispatchEvent(new Event('input'));
    }
}

class DialogBase {
    constructor(element, dialog) {
        this.element = element;
        this.dialog = dialog;
    }

    getOffsetLeft(elem) {
        let offsetLeft = 0;
        do {
            if (!isNaN(elem.offsetLeft)) {
                offsetLeft += elem.offsetLeft;
            }
        } while (elem = elem.offsetParent);
        return offsetLeft;
    }

    getOffsetTop(elem) {
        let offsetTop = 0;
        do {
            if (!isNaN(elem.offsetTop)) {
                offsetTop += elem.offsetTop;
            }
        } while (elem = elem.offsetParent);
        return offsetTop;
    }

    resize() {
        if (window.innerWidth < 768) {
            this.dialog.element.style.top = null;
            this.dialog.element.style.left = null;
            this.dialog.element.style.width = '100%';
            this.dialog.element.style.bottom = 0;
            return
        }

        this.dialog.element.style.top = this.getOffsetTop(this.element) + this.element.offsetHeight + 'px';
        this.dialog.element.style.left = this.getOffsetLeft(this.element) + 'px';
        this.dialog.element.style.bottom = null;
        this.dialog.element.style.minWidth = '200px';
        this.dialog.element.style.width = this.element.offsetWidth + 'px';

        if (this.dialog.element.offsetLeft + this.dialog.element.offsetWidth > window.innerWidth) {
            this.dialog.element.style.left = window.innerWidth - this.dialog.element.offsetWidth + 'px';
        }

        if (this.dialog.element.offsetTop + this.dialog.element.offsetHeight > window.innerHeight) {
            this.dialog.element.style.top = (window.innerHeight - this.dialog.element.offsetHeight) - 30 + 'px';
        }
    }

    render() {
        document.addEventListener('click', (e) => {
            if (!this.dialog.element.contains(e.target)) this.dialog.close();
        });

        this.element.parentElement.appendChild(this.dialog.element);

        this.resize();
        window.addEventListener('resize', () => {
            this.resize();
        });

        // document.body.appendChild(this.dialog.element);
        this.element.parentElement.appendChild(this.dialog.element);
    }
}

class DialogPicker extends DialogBase {
    static lastDialog = null;

    constructor(element, pickerOptions = {}, radiusOptions = {}) {
        super(element, new Dialog());

        this.picker = new ColorPicker(pickerOptions || {
            width: 190,
            color: "#f00",
            borderWidth: 1,
            borderColor: "#fff",
            layoutDirection: 'horizontal',
            layout: [
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'value',
                    }
                },
                {
                    component: iro.ui.Wheel,
                },
                {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'alpha',
                    }
                },

            ],
        });
        this.radius = new Radius(radiusOptions.start, radiusOptions.current, radiusOptions.end);
        this.showRadius = false;

        if (DialogPicker.lastDialog) DialogPicker.lastDialog.close();
        DialogPicker.lastDialog = this.dialog;

        this.inputGroup = document.createElement('div');
        this.inputGroup.classList.add('input-group', 'bg-dark', 'rounded', 'border-1', 'px-2', 'pb-2');

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.classList.add('form-control', 'bg-dark', 'text-light');

        this.span = document.createElement('span');
        this.span.classList.add('input-group-text');
        this.span.style.borderRadius = '0';
        this.span.style.width = '50px';
        this.span.style.height = '38px';

        this.divSpan = document.createElement('div');
        this.divSpan.style.height = '100%';
        this.divSpan.style.background = 'conic-gradient(rgb(204, 204, 204) 25%, rgb(255, 255, 255) 0deg, rgb(255, 255, 255) 50%, rgb(204, 204, 204) 0deg, rgb(204, 204, 204) 75%, rgb(255, 255, 255) 0deg) 0% 0% / 8px 8px';

        const timeout = null;
        this.input.addEventListener('input', e => {
            clearTimeout(timeout);
            setTimeout(() => {
                this.setColor(e.target.value);
            }, 1000);
        });

        this.copyButton = document.createElement('button');
        this.copyButton.classList.add('btn', 'btn-outline-light');
        this.copyButton.innerHTML = '<i class="bi bi-clipboard"></i>';

        this.copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.input.value);
        });

        this.inputGroup.appendChild(this.input);
        this.divSpan.appendChild(this.span);
        this.inputGroup.appendChild(this.divSpan);
        this.inputGroup.appendChild(this.copyButton);

        this.dialog.setTitleText('Cor e Raio');
    }

    setOnRadiusChange(fn) {
        this.radius.setOnRadiusChange(fn);
        this.showRadius = true;
    }

    setRadius(value) {
        this.radius.setRadius(value);
    }

    setColor(color) {
        try {
            this.picker.setColor(color);
        } catch (e) {
            this.picker.setColor('#f00');
        }
    }

    setOnColorChange(fn) {
        this.picker.setOnColorChange(color => {
            fn(color);
            this.input.value = color;
            this.span.style.background = color;
        });
    }

    render() {
        this.dialog.element.appendChild(this.picker.element);
        if (this.showRadius) this.dialog.element.appendChild(this.radius.element);
        this.dialog.element.appendChild(this.inputGroup);
        super.render();
    }
}

class DialogChooseOption extends DialogBase {
    constructor(element, options = []) {
        super(element, new Dialog());
        this.options = options;
        this.dialog.setTitleText('Escolha uma opção');
        this.init();
    }

    init() {
        const div = document.createElement('div');
        div.classList.add('d-flex', 'align-items-center', 'w-100', 'pb-2', 'pe-2', 'pt-2');

        this.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'ms-2', 'w-100');
            button.innerText = option.text;
            button.addEventListener('click', () => {
                setTimeout(() => {
                    option.onClick();
                    this.dialog.close();
                }, 10);
            });
            div.appendChild(button);
        });

        this.dialog.element.appendChild(div);
    }
}

export default DialogPicker;
export { DialogChooseOption };