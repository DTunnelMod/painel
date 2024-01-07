import ConfigExportFactory from '../configExport.js';

class ExportConfigModal {
    constructor(items) {
        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');

        this._element.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Exportar configurações</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex flex-column">
                        <textarea class="form-control mb-3 mh-100" cols="30" rows="10"></textarea>
                        <div class="d-flex justify-content-between gap-3">
                            <button type="button" class="btn-responsive w-100 opacity-75" disabled>LINK</button>
                            <button type="button" class="btn-responsive w-100">ARQUIVO</button>
                            <button type="button" class="btn-responsive w-100">APP</button>
                            <button type="button" class="btn-responsive w-100">COPIAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

        this.modal = new bootstrap.Modal(this._element);
        this.textArea = this._element.querySelector('textarea');
        this.textArea.value = JSON.stringify(this.__parseItems(items), null, 4);

        this._element.querySelectorAll('.btn-responsive')[0].onclick = () => this.export('LINK');
        this._element.querySelectorAll('.btn-responsive')[1].onclick = () => this.export('FILE');
        this._element.querySelectorAll('.btn-responsive')[2].onclick = () => this.export('APP');
        this._element.querySelectorAll('.btn-responsive')[3].onclick = () => this.copy();
    }

    __parseItems(items) {
        const copy = JSON.parse(JSON.stringify(items));
        copy.forEach(item => {
            delete item?.id;
            delete item?.user_id;
            delete item?.category_id;
            delete item?.updated_at;
            delete item?.created_at;
            delete item?.category?.id;
            delete item?.category?.user_id;
            delete item?.category?.status;
            delete item?.category?.created_at;
            delete item?.category?.updated_at;
        });
        return copy.length == 1 ? copy[0] : copy;
    }

    async export(type) {
        try {
            const content = this.textArea.value;

            if (!content || content === '') {
                showToastError('Não há configurações para exportar!');
                return;
            }

            const exporter = ConfigExportFactory.create(type);
            const result = await exporter.export(content);
            if (result) this.textArea.value = result;
        } catch (e) {
            showToastError(e.message);
        }
    }

    show() {
        this.modal.show();
    }

    copy() {
        if (!window.navigator.clipboard) {
            this.textArea.select();
            document.execCommand('copy');
            document.getSelection().removeAllRanges();
        } else {
            window.navigator.clipboard.writeText(this.textArea.value);
        }
        showToastSuccess('Configuração copiada com sucesso!');
    }
}

export default ExportConfigModal;