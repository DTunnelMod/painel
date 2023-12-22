class ConfigStatus {
    constructor(element, options, value) {
        this.element = element;
        this.options = options;
        this.value = value;
        this.onStatusChange = null;
    }

    setOnChange(callback) {
        this.onStatusChange = callback;
    }

    render() {
        this.element.innerHTML = `
            ${this.options.map(option => `<option value="${option.value}">${option.text}</option>`).join('')}  
        `;
        this.element.addEventListener('change', () => {
            this.value = this.element.value;
            this.onStatusChange(this.value);
        });
    }
}

export default ConfigStatus;