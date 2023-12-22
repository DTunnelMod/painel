import AbsDialog from "./dialog.js";

export default class DialogLogger extends AbsDialog {
    render() {
        this.dialogHeader.setTitle('DIALOG DE LOG');
        this.dialogHeader.setCloseButton(e => {
            e.stopPropagation();
            this.close();
        });
        this.dialogContent.element.innerHTML = 'ESTE É UM DIALOG DE LOG';
        this.setStyle({ 'text-align': 'center' });
        super.render();
    }
}
