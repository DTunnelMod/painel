import AbsDialog from './dialog.js';
import DialogDefault from './default.js';
import DialogConfig from './config.js';
import DialogLogger from './logger.js';

class MenuItem {
    constructor(text, icon, fn) {
        this.element = document.createElement('div');
        this.setStyle({
            width: '100%',
            height: '40px',
            display: 'flex',
            padding: '0 10px',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '10px',
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.3)',
            backgroundColor: '#fff',
            color: '#000',
            marginBottom: '10px',
        });
        this.element.innerText = text;
        this.element.addEventListener('click', e => {
            e.stopPropagation();
            fn();
        });

        const iconElement = document.createElement('i');
        iconElement.className = icon;
        iconElement.style.fontSize = '20px';
        iconElement.style.marginRight = '10px';

        this.element.insertBefore(iconElement, this.element.firstChild);

        this.element.addEventListener('mouseover', () => {
            this.element.style.backgroundColor = '#000';
            this.element.style.color = '#fff';
        });

        this.element.addEventListener('mouseout', () => {
            this.element.style.backgroundColor = '#fff';
            this.element.style.color = '#000';
        });
    }

    setStyle(style) {
        Object.keys(style).forEach(key => {
            this.element.style[key] = style[key];
        });
    }
}

class DialogMenu extends AbsDialog {
    constructor(items = []) {
        super();
        this.renderItems(items);
    }

    renderItems(items) {
        items.forEach(item => {
            this.dialogContent.element.appendChild(new MenuItem(
                item.text, item.icon, item.fn,
            ).element);
        });
    }

    render() {
        this.dialogHeader.setTitle('ESCOLHA UMA OPÇÃO');
        this.dialogHeader.setCloseButton(e => {
            e.stopPropagation();
            this.close();
        });
        this.dialogContent.element.style.padding = '5px';
        super.render();
    }
}

class DialogMenuImpl {
    constructor() {
        this.dialogDefault = new DialogDefault();
        this.dialogConfig = new DialogConfig();
        this.dialogLogger = new DialogLogger();
        this.dialogMenu = new DialogMenu(this.__createItems());
    }

    __createItems() {
        return [
            {
                text: 'Dialog padrão',
                icon: 'bi bi-chat',
                fn: () => {
                    console.log('Item 1');
                    this.dialogDefault.render();
                }
            },
            {
                text: 'Dialog de configuração',
                icon: 'bi bi-chat',
                fn: () => {
                    console.log('Item 2');
                    this.dialogConfig.render();
                }
            },
            {
                text: 'Dialog de log',
                icon: 'bi bi-chat',
                fn: () => {
                    console.log('Item 2');
                    this.dialogLogger.render();
                }
            },
            {
                text: 'Sair',
                icon: 'bi bi-x-lg',
                fn: () => {
                    console.log('Item 3');
                    this.dialogMenu.close();
                }
            },
        ];
    }

    render() {
        this.dialogMenu.render();
    }
}

export { DialogMenu, MenuItem };
export default DialogMenuImpl;