class Status {
    constructor() {
        this.element = document.querySelector('.__status')
        this.element.classList.add('form-select', 'mb-3')
        this.value = 'ACTIVE'
    }

    setOnChange(fn) {
        this.element.addEventListener('change', e => {
            this.value = e.target.value
            fn(e.target.value)
        })
    }

    getValue() {
        return this.element.value
    }

    render() {
        this.element.innerHTML = `
            <option value="ACTIVE">ATIVO</option>
            <option value="INACTIVE">INATIVO</option>
            <option value="ALL">TODOS</option>
        `
        this.element.value = this.value
    }
}

export default Status