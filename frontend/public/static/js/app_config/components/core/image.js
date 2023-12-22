import { ComponentStyled } from "./base.js";

class Imagem extends ComponentStyled {
    constructor(style = {}) {
        super(document.createElement('img'), {
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        });

        this.setStyle(style);
    }

    setSrc(src) {
        this.element.src = src;
    }
}

export default Imagem;