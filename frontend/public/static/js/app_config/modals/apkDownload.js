class ApkDownloadModal {
    __html = `
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalToggleLabel">BAIXAR APK</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-2">
                <div class="d-flex flex-column gap-2 justify-content-center">
                    <div class="card">
                        <div class="card-body p-2">
                            <h5 class="card-title d-flex justify-content-center">TUTORIAL</h5>
                            <p class="card-text">Assista esse vídeo para aprender como coloca suas credenciais no aplicativo.</p>
                            <a href="https://www.youtube.com/watch?v=hz2zCdgvRzA&t=2s&ab_channel=DTunnel" class="btn btn-dark w-100 mt-2">Alterar as credenciais</a>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body p-2">
                            <h5 class="card-title d-flex justify-content-center">DTUNNEL SSH</h5>
                            <p class="card-text">Esta versão contém apenas o modo de conexão SSH</p>
                            <a href="https://raw.githubusercontent.com/DTunnelMod/base/main/painel/4.2.5/DTunnelMod%20SSH.apk" class="btn btn-dark w-100 mt-2">BAIXAR</a>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body p-2">
                            <h5 class="card-title d-flex justify-content-center">DTUNNEL PRO</h5>
                            <p class="card-text">Esta versão contém apenas os modos de conexão SSH e OpenVPN</p>
                            <a href="https://raw.githubusercontent.com/DTunnelMod/base/main/painel/4.2.5/DTunnelMod%20Pro.apk" class="btn btn-dark w-100 mt-2">BAIXAR</a>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body p-2">
                            <h5 class="card-title d-flex justify-content-center">DTUNNEL V2RAY</h5>
                            <p class="card-text">Esta versão contém apenas modos de conexão SSH, OpenVPN e V2RAY</p>
                            <a href="https://raw.githubusercontent.com/DTunnelMod/base/main/painel/4.2.5/DTunnelMod%20V2Ray.apk" class="btn btn-dark w-100 mt-2">BAIXAR</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`

    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('modal', 'fade');
        this._element.setAttribute('tabindex', '-1');
        this._element.innerHTML = this.__html;

        this._root = this._element.querySelector('.modal-body');
        this.modal = new bootstrap.Modal(this._element);
    }

    setApp(app) {
        this._root.innerHTML = '';
        this._root.append(app.element);
    }

    setFooter(footer) {
        this._root.append(footer.element);
    }

    show() {
        this.modal.show();
    }

    hide() {
        this.modal.hide();
    }
}

export default ApkDownloadModal;