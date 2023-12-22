class Search {
    constructor(element) {
        this.element = element;
        this.query = '';
        this.onSearch = null;
        this.timeout = null;
    }

    setOnSearch(callback) {
        this.onSearch = callback;
    }

    render() {
        this.element.innerHTML = `
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Pesquisar" value="${this.query}">
                <button class="input-group-text border-1" type="submit">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        `;
        this.element.querySelector('input').addEventListener('keyup', (event) => {
            this.query = this.element.querySelector('input').value;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.onSearch(this.query);
            }, 300);
        });

        this.element.querySelector('button').addEventListener('click', (event) => {
            this.query = this.element.querySelector('input').value;
            clearTimeout(this.timeout);
            this.onSearch(this.query);
        });
    }
}

export default Search;