class Pagination {
    constructor(root) {
        this.root = root;

        this.offset = 1;
        this.limit = 20;
        this.total = 0;
        this.count = 0;

        this.element = document.createElement('ul');
        this.element.classList.add('pagination', 'justify-content-end', 'me-2');

        this.limitDiv = document.createElement('div');
        this.limitDiv.classList.add('d-flex', 'justify-content-end', 'me-2');

        this.callback = null;
    }

    setOnPageChange(callback) {
        this.callback = callback;

        this.element.addEventListener('click', event => {
            event.preventDefault();
            this.offset = parseInt(event.target.dataset.page);
            this.callback();
        });
    }

    renderPreviusButton() {
        let html = '';
        if (this.offset > 1)
            html += `<li class="page-item prev"><a class="page-link" href="#" data-page="${this.offset - 1}"><span aria-hidden="true">&laquo;</span></a></li>`;
        return html;
    }

    renderNextButton() {
        let html = '';
        if (this.offset < Math.ceil(this.total / this.limit))
            html += `<li class="page-item next"><a class="page-link" href="#" data-page="${this.offset + 1}"><span aria-hidden="true">&raquo;</span></a></li>`;
        return html;
    }

    RenderConfigButtons() {
        let html = '';
        const pages = Math.ceil(this.total / this.limit);
        const start = Math.max(1, this.offset - 2);
        const end = Math.min(pages, this.offset + 2);
        for (let i = start; i <= end; i++) {
            html += `<li class="page-item ${i === this.offset ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        return html;
    }

    renderLimitButtons() {
        let html = '';
        const limits = [20, 50, 100];
        for (let i = 0; i < limits.length; i++) {
            html += `<div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio${i + 1}" value="${limits[i]}" ${limits[i] === this.limit ? 'checked' : ''}>
                <label class="form-check label" for="inlineRadio${i + 1}">${limits[i]}</label>
            </div>`;
        }
        return html;
    }

    render() {
        if (this.total <= this.limit) {
            this.element.innerHTML = '';
            return;
        }
        this.element.innerHTML = this.renderPreviusButton() + this.RenderConfigButtons() + this.renderNextButton();

        this.limitDiv.innerHTML = this.renderLimitButtons();
        this.limitDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', event => {
                this.limit = parseInt(event.target.value);
                this.callback();
            });
        });
    }

    mount() {
        this.render();

        const nav = document.createElement('nav');
        nav.appendChild(this.element);

        if (this.root) {
            this.root.appendChild(nav);
            this.root.appendChild(this.limitDiv);
        };
        return nav;
    }
}

export default Pagination;