class InternalError {
    constructor(element, message) {
        this.element = element;
        this.message = message;
    }

    render() {
        const html = `
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class="text-dark">500</h1>
            <h3 class="text-dark">Algo deu errado!</h3>
            <p class="text-dark">${this.message || ''}</p>
            <a href="/" class="btn btn-dark rounded-pill">&larr; VOLTAR</a>
        </div>`;
        this.element.innerHTML = html;
    }
}

class NotFoundError {
    constructor(element) {
        this.element = element;
    }

    render() {
        const html = `
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class="text-dark">404</h1>
            <h3 class="text-dark">Página não encontrada!</h3>
            <a href="/logout" class="btn btn-dark rounded-pill">&larr; VOLTAR</a>
        </div>`;
        this.element.innerHTML = html;
    }
}

class UnauthorizedError {
    constructor(element) {
        this.element = element;
    }

    render() {
        const html = `
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class="text-dark">401</h1>
            <h3 class="text-dark">Você não tem permissão para acessar essa página!</h3>
            <a href="/logout" class="btn btn-dark rounded-pill">&larr; VOLTAR</a>
        </div>`;
        this.element.innerHTML = html;
    }
}

export { InternalError, NotFoundError, UnauthorizedError };