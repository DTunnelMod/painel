import AbsDialog from "./dialog.js";

export default class DialogDefault extends AbsDialog {
    render() {
        this.dialogHeader.setTitle('DIALOG PADRÃO');
        this.dialogHeader.setCloseButton(e => {
            e.stopPropagation();
            this.close();
        });
        this.dialogContent.element.innerText = 'ESTE É UM DIALOG PADRÃO (CHECKUSER, MENSAGEM ETC...)'
        this.setStyle({ 'text-align': 'center' });
        super.render();
    }
}
