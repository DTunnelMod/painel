export default class Table {
    constructor(items = []) {
        this.items = items;

        this.element = document.createElement('div');
        this.element.classList.add('table-responsive-md', 'h-100');
        this.element.innerHTML = this.getTableHTML();

        this.tbody = this.element.querySelector('tbody');
        this.notFound = document.querySelector('.config-not-found');

        this.bindEvents();
    }

    getTableHTML() {
        return `
        <table class="table table-striped table-hover table-sm text-center">
          <thead>
            <tr>
              <th scope="col">
                <input class="form-check form-check-input check-item" type="checkbox">
              </th>
              <th scope="col" class="border-0" placeholder="#">#</th>
              <th scope="col" class="border-0" placeholder="Nome">Nome</th>
              <th scope="col" class="border-0" placeholder="Categoria">Categoria</th>
              <th scope="col" class="border-0" placeholder="Ordem">Ordem</th>
              <th scope="col" class="border-0" placeholder="Modo">Modo</th>
              <th scope="col" class="border-0" placeholder="Status">Status</th>
              <th scope="col" class="border-0" placeholder="Ações">Ações</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;
    }

    bindEvents() {
        const checkAllCheckbox = this.element.querySelector('.check-item');
        checkAllCheckbox.addEventListener('change', () => this.checkAll(checkAllCheckbox.checked));
    }

    appendItem(item) {
        this.items.push(item);
    }

    filter(status) {
        return this.items.filter(item => item.status === status);
    }

    showNotFound() {
        this.element.classList.add('d-none');
        this.notFound.classList.remove('d-none');
    }

    closeNotFound() {
        this.element.classList.remove('d-none');
        this.notFound.classList.add('d-none');
    }

    getCheckedItems() {
        return this.items.filter(item => item.isChecked());
    }

    checkAll(checked) {
        this.items.forEach(item => item.setChecked(checked));
    }

    render() {
        if (this.items.length === 0) {
            this.showNotFound();
            return;
        }

        this.closeNotFound();

        this.tbody.innerHTML = '';
        this.items.forEach(item => this.tbody.appendChild(item.element));
    }
}

export class TableItem {
    constructor(config) {
        this.config = config;
        this.element = document.createElement('tr');
        this.render();
    }

    render() {
        const { id, name, category, sorter, mode, status } = this.config;
        this.element.innerHTML = `
        <td class="align-middle" scope="row">
          <input class="form-check form-check-input check-item" type="checkbox">
        </td>
        <td class="align-middle">${id}</td>
        <td class="align-middle text-nowrap">${name}</td>
        <td class="align-middle">
          <div class="badge rounded-pill text-bg-dark">
            ${category?.name}
          </div>
        </td>
        <td class="align-middle">
          <div class="text-nowrap d-flex gap-2 align-items-center justify-content-center">
            <i class="btn bi bi-arrow-up-circle fs-3" ${sorter > 1 ? '' : 'disabled'}></i>
            ${sorter}
            <i class="btn bi bi-arrow-down-circle fs-3"></i>
          </div>
        </td>
        <td class="align-middle">
          <div class="badge rounded-pill text-bg-dark">
            ${mode}
          </div>
        </td>
        <td class="align-middle">
          <div class="form-check form-switch d-flex justify-content-center">
            <input class="form-check-input toggle-status" type="checkbox" role="switch" ${status === 'ACTIVE' ? 'checked' : ''}>
          </div>
        </td>
        <td class="align-middle">
          <button class="btn btn-sm btn-dark mb-1 btn-c-edit">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-dark mb-1 btn-c-copy">
            <i class="bi bi-files"></i>
          </button>
          <button class="btn btn-sm btn-dark mb-1 btn-c-delete">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
    }

    setOnClickEdit(callback) {
        this.element.querySelector('.btn-c-edit').addEventListener('click', callback);
    }

    setOnClickCopy(callback) {
        this.element.querySelector('.btn-c-copy').addEventListener('click', callback);
    }

    setOnClickDelete(callback) {
        this.element.querySelector('.btn-c-delete').addEventListener('click', callback);
    }

    setOnToggleStatus(callback) {
        this.element.querySelector('.toggle-status').addEventListener('change', callback);
    }

    setOnOrderUp(callback) {
        this.element.querySelector('.bi-arrow-up-circle').addEventListener('click', callback);
    }

    setOnOrderDown(callback) {
        this.element.querySelector('.bi-arrow-down-circle').addEventListener('click', callback);
    }

    isChecked() {
        return this.element.querySelector('.check-item').checked;
    }

    setChecked(checked = true) {
        this.element.querySelector('.check-item').checked = checked;
    }
}