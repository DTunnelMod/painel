import { ComponentStyled, Style } from './base.js';
import Group from "./group.js";
import Svg from "./svg.js";

class Button extends ComponentStyled {
    constructor(text, style) {
        super(document.createElement('button'), style);
        this.span = new ComponentStyled(document.createElement('span'));
        this.span.element.textContent = text;
        this.append(this.span);
    }

    setText(text) {
        this.span.element.textContent = text;
    }

    setOnClickListener(listener) {
        this.element.addEventListener('click', listener);
    }

    setOnTextClickListener(listener) {
        this.span.element.addEventListener('click', listener);
    }
}

class ButtonVpnSetup extends Button {
    constructor(text = 'INICIAR', style = {}) {
        super(text || 'INICIAR', Style.create({
            background: '#444444',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 16px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            outline: 'none',
            width: '100%',
        }));

        this.setStyle(style);
    }
}

class ButtonUpdate extends Svg {
    constructor(style = {}) {
        super({
            width: '24',
            height: '24',
        }, [
            'M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z',
            'M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z'
        ]);

        this.setStyle(Style.create({
            cursor: 'pointer',
            marginLeft: '5px',
            background: '#444444',
            border: 'none',
            outline: 'none',
            borderRadius: '100%',
            padding: '8px 12px',
            fill: '#fff',
        }));

        this.setStyle(style);
    }

    setOnClickListener(listener) {
        this.element.addEventListener('click', listener);
    }
}

class ButtonLogger extends Svg {
    constructor(style = {}) {
        super({
            width: '24',
            height: '24',
        }, [
            'M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z',
            'M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z'
        ]);

        this.setStyle(Style.create({
            cursor: 'pointer',
            marginLeft: '5px',
            background: '#444444',
            border: 'none',
            outline: 'none',
            borderRadius: '100%',
            padding: '8px 12px',
            fill: '#fff',
        }));

        this.setStyle(style);
    }

    setOnClickListener(listener) {
        this.element.addEventListener('click', listener);
    }
}

class ButtonWebView extends Svg {
    constructor(style = {}) {
        super({
            width: '24',
            height: '24',
        }, [
            'M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z'
        ]);

        this.setStyle(Style.create({
            cursor: 'pointer',
            marginLeft: '5px',
            background: '#444444',
            border: 'none',
            outline: 'none',
            borderRadius: '100%',
            padding: '8px 12px',
            fill: '#fff',
        }));

        this.setStyle(style);
    }

    setOnClickListener(listener) {
        this.element.addEventListener('click', listener);
    }
}

class ButtonGroup extends Group {
    constructor(buttons) {
        super(buttons);
        this.setStyle(Style.create({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }));
    }
}

export {
    Button, ButtonVpnSetup,
    ButtonUpdate, ButtonLogger, ButtonWebView,
    ButtonGroup,
};
