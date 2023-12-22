class NoFoundCategory {
    constructor(root) {
        this.root = root
    }

    render() {
        this.root.innerHTML = `
            <div class="d-flex justify-content-center p-5">
                <h4 class="text-muted">INFELIZMENTE NÃO ENCONTRAMOS NENHUMA CATEGORIA</h4>
            </div>
        `
    }
}

export default NoFoundCategory