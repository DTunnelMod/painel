jscolor.presets.default = {
    backgroundColor: '#191A19',
    palette: '#fff #000 #808080 #996e36 #f55525 #ffe438 #88dd20 #22e0cd #269aff #bb1cd4',
    hideOnPaletteClick: true,
    paletteCols: 12,
    sliderSize: 25,
    borderRadius: 5,
    closeText: 'Fechar',
    closeButton: true,
    buttonColor: '#fff',
    buttonHeight: 20,
    padding: 10,
    controlBorderWidth: 1,
    controlBorderColor: '#fff',
    pointerBorderWidth: 1,
    pointerThickness: 2,
    borderWidth: 0,
    width: 250,
    alphaChannel: true,
};

const onPickerColor = (element, color, callback) => {
    const div = document.createElement('div');
    const picker = new jscolor(div);
    picker.fromString(color);

    div.id = 'picker';
    div.style.position = 'absolute';
    div.style.bottom = '0px';
    div.style.right = '0px';
    element.appendChild(div);

    picker.alpha = true;
    picker.onInput = () => callback(picker.toHEXAString());
    picker.onClose = () => {
        picker.onInput = null;
        picker.onClose = null;
        picker.alpha = null;
        element.removeChild(div);
    }
    picker.show();
}


const setPickerColor = (element, color, callback) => {
    const picker = new jscolor(element);
    picker.fromString(color);

    picker.alpha = true;
    picker.onInput = () => callback(picker.toHEXAString());
    picker.onClose = () => {
        picker.onInput = null;
        picker.onClose = null;
    }
}

export { onPickerColor, setPickerColor };