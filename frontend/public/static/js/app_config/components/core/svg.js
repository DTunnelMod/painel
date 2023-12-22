import { ComponentStyled } from "./base.js";

export default class Svg extends ComponentStyled {
    constructor(options = {}, paths = []) {
        super(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        this.setFill('currentColor');

        this.options = {
            fill: '#FFFFFF',
            ...options,
        }

        this.applyOptions();

        paths.forEach(p => this.addPath(p));
    }

    applyOptions() {
        this.setFill(this.options.fill || 'currentColor');
        this.setWidth(this.options.width || '16');
        this.setHeight(this.options.height || '16');
        this.setViewBox(this.options.viewBox || '0 0 16 16');
        this.setXmlns(this.options.xmlns || 'http://www.w3.org/2000/svg');
    }

    setFill(color) {
        this.element.setAttribute('fill', color);
    }

    setWidth(width) {
        this.element.setAttribute('width', width);
    }

    setHeight(height) {
        this.element.setAttribute('height', height);
    }

    setViewBox(viewBox) {
        this.element.setAttribute('viewBox', viewBox);
    }

    setXmlns(xmlns) {
        this.element.setAttribute('xmlns', xmlns);
    }

    addPath(path) {
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        this.element.appendChild(pathElement);
    }
}

class FileIcon extends Svg {
    constructor(options = {}) {
        super({
            width: options.width || '24',
            height: options.height || '24',
        }, [
            'M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317V5.5zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z',
            'M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z'
        ]);
    }
}

class ArrowDownIcon extends Svg {
    constructor(options = {}) {
        super({
            width: options.width || '24',
            height: options.height || '24',
        }, [
            'M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z'
        ]);
    }
}

class PersonIcon extends Svg {
    constructor(options = {}) {
        super({
            width: options.width || '24',
            height: options.height || '24',
        }, [
            'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z'
        ]);
    }
}

class LockIcon extends Svg {
    constructor(options = {}) {
        super({
            width: options.width || '24',
            height: options.height || '24',
        }, [
            'M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z'
        ]);
    }
}

class EyeIcon extends Svg {
    constructor(options = {}) {
        super({
            width: options.width || '24',
            height: options.height || '24',
        }, [
            'M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z',
            'M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z',
        ]);
    }
}

class CloseIcon extends Svg {
    constructor(options = {}) {
        super({
            width: options.width || '24',
            height: options.height || '24',
        }, [
            'M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z'
        ]);
    }

    setOnClickListener(listener) {
        this.element.addEventListener('click', listener);
    }
}

export {
    FileIcon, ArrowDownIcon, PersonIcon,
    LockIcon, EyeIcon, CloseIcon
};