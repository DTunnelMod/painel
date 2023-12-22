import { ComponentStyled, Style } from './base.js';
import Group from './group.js';

class InputGroup extends Group {
    constructor(components = [], style = {}) {
        super(components);
        this.setStyle(Style.create({
            background: '#444444',
            borderRadius: '50px',
            alignItems: 'center',
            padding: '0 10px',
            height: '40px',
            marginBottom: '7px',
        }));

        this.setStyle(style);
    }
}

class Input extends ComponentStyled {
    constructor(style = {}) {
        super(document.createElement('input'), Style.create({
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '16px',
            margin: '0 10px',
            color: '#ffffff',
        }));

        this.setStyle(style);
    }

    setPlaceholder(placeholder) {
        this.element.setAttribute('placeholder', placeholder);
    }

    setValue(value) {
        this.element.value = value;
    }

    setType(type) {
        this.element.setAttribute('type', type);
    }

    setEnabled(enabled) {
        this.element.disabled = !enabled;
    }

    getValue() {
        return this.element.value;
    }
}

export { Input, InputGroup };