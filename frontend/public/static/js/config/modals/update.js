class VersionService {
    async getVersion() {
        const response = await fetch('config/version');
        const result = await response.json();
        return result.data;
    }

    async saveVersion(notes, image) {
        const response = await fetch('config/version', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notes: notes ?? '',
                image: image ?? null,
            })
        });

        if (response.status === 200) {
            showToastSuccess('Notas de atualização atualizada com sucesso');
        } else {
            showToastError('Não foi possível salvar notas de atualização');
        }
    }
}

export default class NotesUpdateModal {
    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');

        this._element.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">NOTAS DE ATUALIZAÇÃO</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex flex-column">
                            <div id="spinner" class="d-flex justify-content-center">
                                <div class="spinner-border text-dark p-5" role="status">
                                    <span class="visually-hidden">Carregando...</span>
                                </div>
                            </div>
                            <div class="area">
                                <textarea id="notes" class="form-control mb-3 mh-100" cols="30" rows="10"></textarea>
                                <div class="mb-3 w-100">
                                    <label class="form-label">URL DE IMAGEM</label>
                                    <div class="input-group">
                                        <input id="image" type="text" class="form-control">
                                        <button id="uploadImage" type="button" class="input-group-text btn-clipboard">
                                            <i class="bi bi-upload"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <div class="mb-3 w-100">
                                        <label class="form-label">VERSAO ATUAL</label>
                                        <input id="currentVersion" type="number" class="form-control" value="0" disabled>
                                    </div>
                                    <div class="mb-3 w-100">
                                        <label class="form-label">NOVA VERSAO</label>
                                        <input id="newVersion" type="number" class="form-control" value="0" disabled>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between gap-3">
                                    <button id="closeButton" type="button" class="btn-responsive w-100">SAIR</button>
                                    <button id="saveButton" type="button" class="btn-responsive w-100">SALVAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        this.modal = new bootstrap.Modal(this._element);
        this.spinner = this._element.querySelector('#spinner');

        this.textArea = this._element.querySelector('#notes');
        this.image = this._element.querySelector('#image');

        this.versionInputs = this._element.querySelectorAll('input[type="number"]');
        this.closeButton = this._element.querySelector('#closeButton');
        this.saveButton = this._element.querySelector('#saveButton');

        this.versionService = new VersionService();
        this.closeButton.addEventListener('click', () => this.hide());
        this.saveButton.addEventListener('click', () => this.saveVersion());

        this._element.querySelector('#uploadImage').addEventListener('click', async () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,image/gif';
            input.onchange = async (e) => {
                const url = await uploadImage(e.target);
                this.image.value = url;
                input.remove()
            }
            input.click();
        })
    }

    async show() {
        this.spinner.classList.remove('d-none');
        this._element.querySelector('.area').classList.add('d-none');
        this.modal.show();

        try {
            const version = await this.versionService.getVersion();
            this.textArea.value = version.notes ?? '';
            this.versionInputs[0].value = version.version ?? 0;
            this.versionInputs[1].value = (version.version ?? 0) + 1;
            this.image.value = version.image ?? ''
        } catch (error) {
            console.error(error);
            showToastError('Erro ao carregar a versão');
        } finally {
            this.spinner.classList.add('d-none');
            this._element.querySelector('.area').classList.remove('d-none');
        }
    }

    hide() {
        this.modal.hide();
        this._element.remove();
    }

    async saveVersion() {
        const notes = this.textArea.value;
        const image = this.image.value;
        await this.versionService.saveVersion(notes, image);
        this.hide();
    }
}
