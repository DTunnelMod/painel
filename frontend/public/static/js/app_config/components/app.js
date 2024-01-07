import App from './core/app.js';
import Card from './core/card.js';

import { ButtonGroup, ButtonLogger, ButtonUpdate, ButtonVpnSetup, ButtonWebView } from './core/button.js';
import { Input, InputGroup } from './core/input.js';
import { ArrowDownIcon, FileIcon, LockIcon, PersonIcon, EyeIcon } from './core/svg.js';

import DialogPicker, { DialogChooseOption } from './core/dialogPicker.js';
import Imagem from './core/image.js';
import Iframe from './core/iframe.js';

export default class AppConfigView extends App {
    static lastWebview;

    constructor(appConfig, style = {}) {
        super({
            borderRadius: '5px',
            position: 'relative',
            ...style,
        })

        this.appConfig = appConfig;

        this.element.classList.add('shadow');

        this.appLogo = new Imagem({ height: '70px', margin: '10px auto', });

        this.card = new Card({ width: '100%', padding: '6px', });

        this.config = new Input();
        this.config.setType('button');

        this.fileSvg = new FileIcon({ width: '20px', height: '20px' });
        this.arrowSvg = new ArrowDownIcon({ width: '20px', height: '20px' });
        this.configGroup = new InputGroup([this.fileSvg, this.config, this.arrowSvg], { cursor: 'pointer', height: '30px' });

        this.username = new Input();
        this.username.setEnabled(false);
        this.personSvg = new PersonIcon({ width: '20px', height: '20px' });
        this.usernameGroup = new InputGroup([this.personSvg, this.username], { height: '30px' });

        this.password = new Input();
        this.password.setEnabled(false);
        this.lockSvg = new LockIcon({ width: '20px', height: '20px' });
        this.eyeSvg = new EyeIcon({ width: '20px', height: '20px' });
        this.passwordGroup = new InputGroup([this.lockSvg, this.password, this.eyeSvg], { height: '30px' });

        this.buttonVpnStart = new ButtonVpnSetup(null, { padding: '7px 0', width: '100%', fontSize: '10px' });

        this.buttonUpdate = new ButtonUpdate({ padding: '7px', width: '35px', height: 'auto' });
        this.buttonLogger = new ButtonLogger({ padding: '7px', width: '35px', height: 'auto' });
        this.buttonWebView = new ButtonWebView({ padding: '7px', width: '35px', height: 'auto' });
        this.buttonGroup = new ButtonGroup([this.buttonVpnStart, this.buttonUpdate, this.buttonLogger, this.buttonWebView], { width: '100%' });

        this.cardStatus = new Card({ padding: '15px 0', margin: '15px 0', width: '100%', });

        this.androidWebview = new Iframe({
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'absolute',
            borderRadius: '5px',
            colorScheme: 'normal',
        })

        this.androidWebview.setOnloadContent(() => {
            this.androidWebview.setIframContentHtmlStyle({
                transform: 'scale(0.75)',
                transformOrigin: '0 0',
                width: '134%',
                height: '134%',
                position: 'absolute',
                overflow: 'hidden',
            })
            this.androidWebview.setIframContentBodyStyle({ height: '100%', width: '100%' })
        })

        this.layoutWebview = new Iframe({
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            position: 'absolute',
            borderRadius: '5px',
            colorScheme: 'normal',
        })

        this.layoutWebview.setOnloadContent(() => {
            this.layoutWebview.setIframContentHtmlStyle({
                transform: 'scale(0.75)',
                transformOrigin: '0 0',
                width: '134%',
                height: '134%',
                position: 'absolute',
                overflow: 'hidden',
            })
            this.layoutWebview.setIframContentBodyStyle({ height: '100%', width: '100%' })
        })

        this.appConfig.observe(config => {
            if (!config?.app_layout_webview_enabled && config.app_support_button) {
                this.androidWebview.loadHtmlContent(config.app_support_button);
                this.androidWebview.setStyle({ display: 'block' })
            } else {
                this.androidWebview.setStyle({ display: 'none' })
            }

            if (config?.app_layout_webview_enabled && config.app_layout_webview) {
                this.layoutWebview.loadHtmlContent(config.app_layout_webview);
                this.layoutWebview.setStyle({ display: 'block' })
            } else {
                this.layoutWebview.setStyle({ display: 'none' })
            }

            if (config.app_logo) {
                this.appLogo.setSrc(config.app_logo);
                this.appLogo.setStyle({ display: config?.app_layout_webview_enabled ? 'none' : 'flex' })
            } else {
                this.appLogo.setStyle({ display: 'none' })
            }

            if (config.app_background_type.selected === 'COLOR') {
                this.setStyle({ background: config.app_background_color });
            }

            if (config.app_background_type.selected === 'IMAGE') {
                this.setStyle({
                    backgroundImage: `url(${config.app_background_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                });
            }

            this.card.setStyle({
                cursor: 'pointer',
                background: config.app_card_color,
                borderRadius: config.app_card_radius + 'px',
                display: config?.app_layout_webview_enabled && config.app_layout_webview ? 'none' : 'flex'
            });

            this.cardStatus.setStyle({
                cursor: 'pointer',
                background: config.app_card_status_color || config.app_card_color,
                borderRadius: config.app_card_status_radius + 'px',
                display: config?.app_layout_webview_enabled && config.app_layout_webview ? 'none' : 'flex'
            });

            this.configGroup.setStyle({
                background: config.app_input_color || 'transparent',
                borderRadius: config.app_input_radius + 'px',
                border: '2px solid ' + config.app_border_color
            });
            this.usernameGroup.setStyle({
                background: config.app_input_color || 'transparent',
                borderRadius: config.app_input_radius + 'px',
                border: '2px solid ' + config.app_border_color
            });
            this.passwordGroup.setStyle({
                background: config.app_input_color || 'transparent',
                borderRadius: config.app_input_radius + 'px',
                border: '2px solid ' + config.app_border_color
            });
            this.buttonVpnStart.setStyle({
                background: config.app_button_color,
                borderRadius: config.app_button_radius + 'px'
            });
            this.buttonUpdate.setStyle({
                background: config.app_button_color,
                borderRadius: config.app_button_radius + 'px',
                display: config.app_btn_update_enabled ? 'flex' : 'none'
            });
            this.buttonLogger.setStyle({
                background: config.app_button_color,
                borderRadius: config.app_button_radius + 'px',
                display: config.app_btn_logger_enabled ? 'flex' : 'none'
            });
            this.buttonWebView.setStyle({
                background: config.app_button_color,
                borderRadius: config.app_button_radius + 'px',
                display: config.app_btn_page_enabled ? 'flex' : 'none'
            });

            const icons = [this.fileSvg, this.arrowSvg, this.personSvg, this.lockSvg, this.eyeSvg];
            icons.forEach(icon => {
                icon.setStyle({ fill: config.app_icon_color });
            });

            this.buttonUpdate.setStyle({ fill: config.app_text_color });
            this.buttonLogger.setStyle({ fill: config.app_text_color });
            this.buttonWebView.setStyle({ fill: config.app_text_color });
            this.buttonVpnStart.span.setStyle({ color: config.app_text_color });
        });

        this.render()
    }

    render() {
        this.card.append(this.configGroup);
        this.card.append(this.usernameGroup);
        this.card.append(this.passwordGroup);
        this.card.append(this.buttonGroup);

        this.append(this.androidWebview)
        this.append(this.layoutWebview)
        this.append(this.appLogo);
        this.append(this.card);
        this.append(this.cardStatus);
    }
}

export class AppConfigPreview extends AppConfigView {
    constructor(appConfig, style = {}) {
        super(appConfig, style);

        this.setStyle({ width: '100%', height: '100%', padding: '1rem' });
        this.appLogo.setStyle({
            height: '130px',
            position: 'absolute',
            top: '50px',
        });

        this.card.setStyle({
            marginTop: appConfig.app_logo ? '50px' : '0px',
            padding: '10px',
        });
        this.cardStatus.setStyle({ padding: '20px 0', margin: '25px 0', });

        this.fileSvg.setStyle({ width: '26px', height: '26px' });
        this.arrowSvg.setStyle({ width: '26px', height: '26px' });
        this.personSvg.setStyle({ width: '26px', height: '26px' });
        this.lockSvg.setStyle({ width: '26px', height: '26px' });
        this.eyeSvg.setStyle({ width: '26px', height: '24px' });

        this.configGroup.setStyle({ width: '100%', height: '40px', marginBottom: '10px' });
        this.usernameGroup.setStyle({ width: '100%', height: '40px', marginBottom: '10px' });
        this.passwordGroup.setStyle({ width: '100%', height: '40px', marginBottom: '10px' });
        this.buttonVpnStart.setStyle({ width: '100%', height: '40px', fontSize: '14px' });
        this.buttonUpdate.setStyle({ width: '50px', padding: '10px' });
        this.buttonLogger.setStyle({ width: '50px', padding: '10px' });
        this.buttonWebView.setStyle({ width: '50px', padding: '10px' });

        this.androidWebview.setStyle({ pointerEvents: 'none' });
        this.androidWebview.setOnloadContent(() => {
            this.androidWebview.setIframContentHtmlStyle({
                transform: null,
                transformOrigin: null,
                width: null,
                height: null,
                position: null,
            })
            this.androidWebview.setIframContentBodyStyle({ height: null })
        })

        this.layoutWebview.setOnloadContent(() => {
            this.layoutWebview.setIframContentHtmlStyle({
                transform: null,
                transformOrigin: null,
                width: null,
                height: null,
                position: null,
            })
            this.layoutWebview.setIframContentBodyStyle({ height: null })
        })
    }
}

export class AppConfigAdvancedView extends AppConfigPreview {
    constructor(appConfig) {
        super(appConfig);

        this.addEventListener('click', e => {
            e.stopPropagation();

            const type = this.appConfig.app_background_type.selected;
            if (type === 'COLOR') {
                const picker = new DialogPicker(this.element, null);
                picker.setOnColorChange(color => {
                    this.appConfig.app_background_color = color;
                });
                picker.setColor(this.appConfig.app_background_color);
                picker.render();
                return;
            }

            if (type === 'IMAGE') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,image/gif';
                input.onchange = async (e) => {
                    const url = await uploadImage(e.target);
                    this.appConfig.app_background_image = url;
                }
                input.click();
            }
        });

        this.appLogo.addEventListener('click', e => {
            e.stopPropagation();

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,image/gif';
            input.onchange = async (e) => {
                const url = await uploadImage(e.target);
                this.appConfig.app_logo = url;
            }
            input.click();
        });

        if (window.innerWidth < 600) {
            this.setStyle({ borderRadius: '0' });
        }

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            this.setStyle(width < 600 ? { borderRadius: '0' } : { borderRadius: '5px' });
        });
    }

    setCardOnPicker() {
        this.card.element.addEventListener('click', (e) => {
            e.stopPropagation();

            const picker = new DialogPicker(this.card.element, null);
            picker.setOnColorChange(color => {
                this.appConfig.app_card_color = color;
            });
            picker.setColor(this.appConfig.app_card_color);

            if (this.appConfig.app_card_radius) {
                picker.setOnRadiusChange(radius => {
                    this.appConfig.app_card_radius = radius;
                });
                picker.setRadius(this.appConfig.app_card_radius);
            }
            picker.render();
        });
        this.cardStatus.element.addEventListener('click', (e) => {
            e.stopPropagation();

            const picker = new DialogPicker(this.card.element, null);
            picker.setOnColorChange(color => {
                if (this.appConfig.app_card_status_color) {
                    this.appConfig.app_card_status_color = color
                } else {
                    this.appConfig.app_card_color = color
                }
            });

            picker.setColor(this.appConfig.app_card_status_color || this.appConfig.app_card_color);
            if (this.appConfig.app_card_status_radius) {
                picker.setOnRadiusChange(radius => {
                    if (this.appConfig.app_card_status_radius == radius) return;
                    if (this.appConfig.app_card_status_radius) {
                        this.appConfig.app_card_status_radius = radius
                    } else {
                        this.appConfig.app_card_radius = radius
                    }
                });
                picker.setRadius(this.appConfig.app_card_status_radius || this.appConfig.app_card_radius);
            }
            picker.render();
        });
    }

    setInputsOnPicker() {
        const inputs = [this.configGroup, this.usernameGroup, this.passwordGroup];

        inputs.forEach(input => {
            input.element.addEventListener('click', (e) => {
                e.stopPropagation();

                const picker = new DialogPicker(this.element, null);
                if (!this.appConfig.app_input_radius && !this.appConfig.app_input_color) {
                    picker.setOnColorChange(color => {
                        this.appConfig.app_border_color = color;
                    });
                    picker.setColor(this.appConfig.app_border_color);
                    picker.render();
                    return;
                }

                picker.setOnRadiusChange(radius => this.appConfig.app_input_radius = radius);
                picker.setRadius(this.appConfig.app_input_radius);
                const chooser = new DialogChooseOption(this.element,
                    [
                        {
                            text: 'BORDA',
                            onClick: () => {
                                picker.setOnColorChange(color => {
                                    this.appConfig.app_border_color = color;
                                });
                                picker.setColor(this.appConfig.app_border_color);
                                picker.render();
                            }
                        },
                        {
                            text: 'FUNDO',
                            onClick: () => {
                                picker.setOnColorChange(color => {
                                    this.appConfig.app_input_color = color;
                                });

                                picker.setColor(this.appConfig.app_input_color);
                                picker.render();
                            }
                        }
                    ]);
                chooser.render();
            });
        });
    }

    setOnButtonsOnPicker() {
        this.buttonVpnStart.addEventListener('click', (e) => {
            e.stopPropagation();

            const picker = new DialogPicker(this.element, null);

            picker.setOnColorChange(color => {
                this.appConfig.app_button_color = color;
            });
            picker.setColor(this.appConfig.app_button_color);

            if (this.appConfig.app_button_radius) {
                picker.setOnRadiusChange(radius => {
                    this.appConfig.app_button_radius = radius;
                });
                picker.setRadius(this.appConfig.app_button_radius);
            }
            picker.render();
        });

        this.buttonUpdate.addEventListener('click', (e) => {
            e.stopPropagation();

            const picker = new DialogPicker(this.element, null);

            picker.setOnColorChange(color => {
                this.appConfig.app_button_color = color;
            });
            picker.setColor(this.appConfig.app_button_color);

            if (this.appConfig.app_button_radius) {
                picker.setOnRadiusChange(radius => {
                    this.appConfig.app_button_radius = radius;
                });
                picker.setRadius(this.appConfig.app_button_radius);
            }
            picker.render();
        });
        this.buttonLogger.addEventListener('click', (e) => {
            e.stopPropagation();

            const picker = new DialogPicker(this.element, null);

            picker.setOnColorChange(color => {
                this.appConfig.app_button_color = color;
            });
            picker.setColor(this.appConfig.app_button_color);

            if (this.appConfig.app_button_radius) {
                picker.setOnRadiusChange(radius => {
                    this.appConfig.app_button_radius = radius;
                });
                picker.setRadius(this.appConfig.app_button_radius);
            }
            picker.render();
        });
    }

    setOnIconsOnPicker() {
        const icons = [this.fileSvg, this.arrowSvg, this.personSvg, this.lockSvg, this.eyeSvg];
        icons.forEach(icon => {
            icon.element.addEventListener('click', e => {
                e.stopPropagation();

                const picker = new DialogPicker(this.element, null);

                picker.setOnColorChange(color => {
                    this.appConfig.app_icon_color = color;
                });

                picker.setColor(this.appConfig.app_icon_color);
                picker.render();
            });
        });
    }

    setOnTextsOnPicker() {
        this.buttonVpnStart.setOnTextClickListener(e => {
            e.stopPropagation();

            const picker = new DialogPicker(this.element, null);

            picker.setOnColorChange(color => {
                this.appConfig.app_text_color = color;
            });

            picker.setColor(this.appConfig.app_text_color);
            picker.render();
        });
    }

    render() {
        this.setCardOnPicker();
        this.setInputsOnPicker();
        this.setOnButtonsOnPicker();
        this.setOnIconsOnPicker();
        this.setOnTextsOnPicker();
        return super.render();
    }
}
