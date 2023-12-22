import { ComponentStyled, Style } from './base.js';

export default class Group extends ComponentStyled {
    constructor(components = []) {
        super(document.createElement('div'), Style.create({
            display: 'flex',
        }));

        components.forEach(c => this.append(c));
    }
}