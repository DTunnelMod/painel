import CategoryTable, { TableItem } from "./components/table.js";
import Category from "./models.js";

import { Observable } from "../common/observer.js";
import { Observer } from "../common/observer.js";

import { ButtonAdd, ButtonDelete } from "./components/buttons.js";
import { CategoryForm, CategoryModal } from "./modals/category.js";
import Status from "./components/status.js";
import Pagination from "../common/pagination.js";

import NoFoundCategory from "./errors/noFoundCategory.js";
import { InternalError } from "../common/errors.js";

class CategoryList extends Observable {
    constructor(categories = []) {
        super();
        this.categories = categories
        this.orderBySorter()
    }

    orderBySorter() {
        this.categories.sort((a, b) => a.sorter - b.sorter)
    }

    add(category) {
        if (!category.id) category.id = this.categories.length + 1
        this.categories.push(category)
        this.orderBySorter()
        this.notify('add', category)
    }

    remove(category) {
        this.categories = this.categories.filter(c => c.id !== category.id)
        this.orderBySorter()
        this.notify('remove', category)
    }

    update(category) {
        this.categories = this.categories.map(c => c.id === category.id ? category : c)
        this.orderBySorter()
        this.notify('update', category)
    }

    getById(id) {
        return this.categories.find(c => c.id === id)
    }

    getByStatus(status) {
        return this.categories.filter(c => c.status === status)
    }

    static fromJson(data) {
        return new CategoryList(data.map(Category.fromJson))
    }
}

const showSpinner = root => {
    const spinner = `
        <div class="d-flex justify-content-center p-5 __spinner">
            <div class="spinner-border p-5" role="status"></div>
        </div>
    `
    root.innerHTML = spinner
}

let csrfToken = getCsrfTokenHead();

const main = async () => {
    const root = document.getElementById('root')
    showSpinner(root)

    const status = new Status()
    const pagination = new Pagination(document.querySelector('#pagination'))

    status.setOnChange(() => render())
    status.render()

    const getCategories = async () => {
        try {

            const response = await fetch(`/category_list?offset=${pagination.offset}&limit=${pagination.limit}`, {
                headers: {}
            })

            const data = await response.json()

            pagination.offset = data.data.offset
            pagination.limit = data.data.limit
            pagination.total = data.data.total
            pagination.mount()

            return CategoryList.fromJson(data.data.result)

        } catch (e) {
            const internalError = new InternalError(document.querySelector('.card', e.message))
            internalError.render()
            throw e
        }
    }

    const categoryList = await getCategories()
    pagination.setOnPageChange(async () => {
        showSpinner(root);

        categoryList.categories = (await getCategories()).categories
        render()
    })

    const render = () => {
        root.innerHTML = ''
        const categories = status.getValue() === 'ALL' ?
            categoryList.categories :
            categoryList.getByStatus(status.getValue())

        if (categories.length === 0) {
            const noFoundCategory = new NoFoundCategory(root)
            noFoundCategory.render()
            return
        }

        const items = categories.map(c => {
            const item = new TableItem(c)

            item.setOnClickDelete(() => {
                showAlertConfirm(() => categoryList.remove(c))
            })

            item.setOnClickEdit(() => {
                const form = new CategoryForm(c)
                const modal = new CategoryModal(form)

                modal.setOnSave(() => {
                    if (!form.validate()) return
                    categoryList.update(c)
                    modal.hide()
                })
                modal.show()
            })

            return item
        })

        const table = new CategoryTable(items)
        root.appendChild(table.render())

        const btnDelete = new ButtonDelete()
        btnDelete.setOnClick(() => {
            const items = table.getCheckedItems()
            items.forEach(item => categoryList.remove(item.category))
        })

    }

    categoryList.register(new Observer('add', async category => {

        render()
        //showToastInfo(`Crinado categoria ${category.name}...`)

        const response = await fetch('/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category)
        });

        const data = await response.json()

        if (response.status == 201) {
            category.id = data.category_id;
            showToastSuccess(`Categoria ${category.name} criada com sucesso!`)
            render()
            return
        }

        showToastError(`Erro ao criar categoria ${category.name}!`)
        categoryList.remove(category)
        render()
    }))

    categoryList.register(new Observer('remove', async category => {
        render()

        // showToastInfo(`Removendo categoria ${category.name}...`)

        try {

            const response = await fetch(`/category/${category.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status == 204) {
                showToastSuccess(`Categoria ${category.name} removida com sucesso!`)
                return
            }

            const data = await response.json();
            if (data.message) {
                showToastError(data.message);
                return
            }

        } catch (err) {
            showToastError(`Erro ao remover categoria ${category.name}!`)
        }

        render()
    }))

    categoryList.register(new Observer('update', async category => {
        render()

        //showToastInfo(`Atualizando categoria ${category.name}...`)

        const response = await fetch(`/category/${category.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        });

        const csrfTokenRefresh = getCsrfTokenRefresh(response);
        if (csrfTokenRefresh) csrfToken = csrfTokenRefresh;

        const data = await response.json();

        if (data.status == 200) {
            showToastSuccess(`Categoria ${category.name} atualizada com sucesso!`)
            return;
        }

        showToastError(`Erro ao atualizar categoria ${category.name}!`)
    }))

    const btnAdd = new ButtonAdd()
    btnAdd.setOnClick(() => {
        const category = new Category(null, '', '#00000080', 'ACTIVE', 1)
        const form = new CategoryForm(category)
        const modal = new CategoryModal(form)

        modal.setOnSave(() => {
            if (!form.validate()) return
            categoryList.add(category)
            modal.hide()
        })

        modal.show()
    });

    render()
}

main()