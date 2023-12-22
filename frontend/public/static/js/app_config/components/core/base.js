class Style {
    constructor(styles = {}) {
        this.styles = styles;
    }

    setStyle(key, value) {
        this.styles[key] = value;
    }

    getStyle(key) {
        return this.styles[key];
    }

    getStyles() {
        return this.styles;
    }

    static create(styles) {
        return new Style(styles);
    }
}

class Component {
    constructor(element) {
        this.element = element;
    }

    append(component) {
        this.element.appendChild(component.element);
    }

    addEventListener(type, listener) {
        this.element.addEventListener(type, listener, false);
    }
}

class ComponentStyled extends Component {
    constructor(element, style) {
        super(element);
        if (style) this.setStyle(style);
    }

    setStyle(style) {
        if (!(style instanceof Style)) style = Style.create(style);
        Object.keys(style.getStyles()).forEach((key) => {
            this.element.style[key] = style.getStyle(key);
        });
    }
}

export { Component, ComponentStyled, Style };