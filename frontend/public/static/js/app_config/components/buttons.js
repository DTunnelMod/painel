import { Component } from "./core/base.js";


class OnClickListener extends Component {
    setOnClick(callback) {
        this.element.addEventListener('click', e => {
            e.stopPropagation();
            callback();
        });
    }
}

class EditIcon extends OnClickListener {
    __html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffff00" viewBox="0 0 16 16">
        <path
            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
    </svg>`

    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('background-svg');
        this.element.innerHTML = this.__html;
    }
}

class ToggleIcon extends OnClickListener {
    __html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#00ff00"
        class="bi bi-check2-circle" viewBox="0 0 16 16">
        <path
            d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
        <path
            d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
    </svg>`

    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('background-svg');
        this.element.innerHTML = this.__html;
    }
}

class ExportIcon extends OnClickListener {
    __html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#007bff"
        class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
        <path
            d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z" />
        <path
            d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
    </svg>`

    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('background-svg');
        this.element.innerHTML = this.__html;
    }
}

class DeleteIcon extends OnClickListener {
    __html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" class="bi bi-trash"
        viewBox="0 0 16 16">
        <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path fill-rule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>`

    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('background-svg');
        this.element.innerHTML = this.__html;
    }
}

class PhoneIcon extends OnClickListener {
    __html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2AD153" class="bi bi-phone" viewBox="0 0 16 16">
        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>`

    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('background-svg');
        this.element.innerHTML = this.__html;
    }
}

class CodeIcon extends OnClickListener {
    __html = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffff00" class="bi bi-code-slash" viewBox="0 0 16 16">
        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
    </svg>`

    constructor() {
        super(document.createElement('div'));
        this.element.classList.add('background-svg');
        this.element.innerHTML = this.__html;
    }
}

export {
    EditIcon, ToggleIcon, CodeIcon,
    ExportIcon, DeleteIcon, PhoneIcon,
}