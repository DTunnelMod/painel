import { ComponentStyled, Style } from './base.js';

export default class Card extends ComponentStyled {
    constructor(style = {}) {
        super(document.createElement('div'), Style.create({
            width: '85%',
            background: '#333333',
            padding: '10px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }));

        this.setStyle(style);
    }
}