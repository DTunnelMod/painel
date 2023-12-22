import { CodeIcon, DeleteIcon, EditIcon, ExportIcon, PhoneIcon, ToggleIcon } from './buttons.js';
import { ComponentStyled } from './core/base.js';


class AppConfigAdvancedViewFooter extends ComponentStyled {
    __html = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-menu-button-wide" viewBox="0 0 16 16">
            <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v2A1.5 1.5 0 0 1 14.5 5h-13A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-13z"/>
            <path d="M2 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm10.823.323-.396-.396A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16"
            height="16" fill="currentColor" viewBox="0 0 16 16">
            <path
                d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07zM8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path
                d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            viewBox="0 0 16 16">
            <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </svg>
    `

    constructor(currentBgType) {
        super(document.createElement('div'));
        this.element.classList.add('app');
        this.element.innerHTML = this.__html;
        this.currentBgType = currentBgType;
        this.toggleBackgroundType();

        this.element.addEventListener('click', e => e.stopPropagation());
    }

    toggleBackgroundType() {
        if (this.currentBgType === 'COLOR') {
            this.element.children[2].style.display = 'none';
            this.element.children[3].style.display = 'block';
        } else {
            this.element.children[3].style.display = 'none';
            this.element.children[2].style.display = 'block';
        }
    }

    setOnClickMinimize(callback) {
        this.element.children[0].addEventListener('click', e => {
            callback();
        });
    }

    setOnClickToggleBackground(callback) {
        this.element.children[2].addEventListener('click', e => {
            this.currentBgType = 'COLOR'
            this.toggleBackgroundType();
            callback(this.currentBgType);
        });

        this.element.children[3].addEventListener('click', e => {
            this.currentBgType = 'IMAGE'
            this.toggleBackgroundType();
            callback(this.currentBgType);
        });
    }

    setOnMenuClick(callback) {
        this.element.children[1].addEventListener('click', e => {
            callback();
        });
    }

    setOnClickSave(callback) {
        this.element.children[4].addEventListener('click', e => {
            callback();
        });
    }
}

class AppConfigViewFooter extends ComponentStyled {
    constructor(options = {}) {
        super(document.createElement('div'));
        this.element.addEventListener('click', e => e.stopPropagation());

        this.options = options;

        this.editIcon = new EditIcon();
        this.toggleIcon = new ToggleIcon();
        this.exportIcon = new ExportIcon();
        this.deleteIcon = new DeleteIcon();
        this.phoneIcon = new PhoneIcon();
        this.codeIcon = new CodeIcon();

        this.render()
    }

    setOnClickEdit(callback) {
        this.editIcon.setOnClick(callback);
    }

    setOnClickCode(callback) {
        this.codeIcon.setOnClick(callback);
    }

    setOnClickToggle(callback) {
        this.toggleIcon.setOnClick(callback);
    }

    setOnClickExport(callback) {
        this.exportIcon.setOnClick(callback);
    }

    setOnClickDelete(callback) {
        this.deleteIcon.setOnClick(callback);
    }

    setOnClickPhone(callback) {
        this.phoneIcon.setOnClick(callback);
    }

    render() {
        this.element.appendChild(this.editIcon.element);
        this.element.appendChild(this.phoneIcon.element);
        if (this.options.code) {
            this.element.appendChild(this.codeIcon.element);
        }

        if (this.options.toggle) {
            this.element.appendChild(this.toggleIcon.element)
        };

        this.element.appendChild(this.exportIcon.element);

        if (this.options.delete) {
            this.element.appendChild(this.deleteIcon.element);
        }
    }
}

export { AppConfigAdvancedViewFooter, AppConfigViewFooter };