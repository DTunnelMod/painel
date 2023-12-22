import { ComponentStyled, Style } from './base.js';

export default class App extends ComponentStyled {
    constructor(style = {}) {
        super(document.createElement('div'), Style.create({
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#202020',
        }));

        this.setStyle(style);
    }
}