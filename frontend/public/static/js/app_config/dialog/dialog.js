class Dialog {
    constructor() {
        this.element = document.createElement('div');
        this.setStyle({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1056',
            border: '#fff 1px solid'
        });
    }

    setStyle(style) {
        Object.keys(style).forEach(key => {
            this.element.style[key] = style[key];
        });
    }
}

class DialogHeader {
    constructor(dialog) {
        this.element = document.createElement('div');
        this.closeButton = document.createElement('button');
        this.closeButtonIcon = document.createElement('i');

        this.setStyle({
            width: '100%',
            height: '35px',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
        dialog.element.appendChild(this.element);
    }

    setStyle(style) {
        Object.keys(style).forEach(key => {
            this.element.style[key] = style[key];
        });
    }

    setTitle(title) {
        this.element.innerText = title;
    }

    setCloseButton(fn) {
        this.closeButtonIcon.className = 'bi bi-x-lg';
        this.closeButtonIcon.style.fontSize = '15px';
        this.closeButtonIcon.style.border = 'solid 1px #FFFFFF';
        this.closeButtonIcon.style.borderRadius = '3px'
        this.closeButtonIcon.style.padding = '3px'
        this.closeButtonIcon.style.color = '#000000';

        this.closeButton.style.position = 'absolute';
        this.closeButton.style.right = '1px';
        this.closeButton.style.backgroundColor = 'transparent';
        this.closeButton.style.border = 'none';
        this.closeButton.style.outline = 'none';
        this.closeButton.style.cursor = 'pointer';

        this.closeButton.appendChild(this.closeButtonIcon);
        this.closeButton.addEventListener('click', fn);
        this.element.appendChild(this.closeButton);
    }
}

class DialogContent {
    constructor(dialog) {
        this.element = document.createElement('div');
        this.setStyle({
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        });
        dialog.element.appendChild(this.element);
    }

    setStyle(style) {
        Object.keys(style).forEach(key => {
            this.element.style[key] = style[key];
        });
    }
}

class AbsDialog {
    static dialog = null;

    constructor() {
        this.dialog = new Dialog();
        this.dialogHeader = new DialogHeader(this.dialog);
        this.dialogContent = new DialogContent(this.dialog);
    }

    setStyle(style) {
        this.dialog.setStyle(style);
        this.renderColor();
    }

    renderColor() {
        const isDark = () => {
            const color = window.getComputedStyle(this.dialog.element).backgroundColor;
            if (!color || color === 'transparent') return true;

            const rgb = color.match(/\d+/g).map(Number);
            const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            return brightness < 125;
        }

        if (isDark()) {
            this.dialogHeader.setStyle({ color: '#fff' });
            this.dialogContent.setStyle({ color: '#fff' });
        }
    }

    render() {
        if (AbsDialog.dialog) {
            AbsDialog.dialog.close();
        }
        AbsDialog.dialog = this;
        document.body.appendChild(this.dialog.element);
    }

    close() {
        this.dialog.element.remove();
    }

    setOnClickListener(fn) {
        this.dialog.element.addEventListener('click', e => {
            e.stopPropagation();
            fn();
        });
    }
}

export default AbsDialog;

