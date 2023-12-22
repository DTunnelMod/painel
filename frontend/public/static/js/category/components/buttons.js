class Button {
    constructor(element) {
        this.button = element
    }

    setOnClick(fn) {
        this.button.addEventListener('click', fn);
    }
}

class ButtonAdd extends Button {
    constructor() {
        super(document.querySelector('.__btn__add'));
    }
}



class ButtonDelete extends Button {
    constructor() {
        super(document.querySelector('.__btn__delete'));
    }
}

export { ButtonAdd, ButtonDelete };