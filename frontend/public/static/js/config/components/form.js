import ConfigModel, { Mode } from "../models.js"
import {
    ConfigCategory,
    ConfigDesc,
    ConfigDns1, ConfigDns2, ConfigIcon, ConfigName, ConfigOpenVPN, ConfigOrder, ConfigPassword,
    ConfigPayload, ConfigPort, ConfigProxy,
    ConfigServer, ConfigSni, ConfigTlsVersion, ConfigType, ConfigUdpPort,
    ConfigUrlCheckUser, ConfigUsername, ConfigUuid, ConfigV2ray, InputFiled
} from "./fields.js"

class ConfigForm {
    constructor(config, categories) {
        this._element = document.createElement('form')
        this._element.classList.add('d-flex', 'flex-column', 'gap-3')

        this.mode = new ConfigType(Object.values(Mode))
        this.mode.setSelected(config.mode)

        this.name = new ConfigName(config.name ?? '')
        this.desc = new ConfigDesc(config.description ?? '')

        this.category = new ConfigCategory(categories)
        this.category.setSelected(config.category_id)

        this.order = new ConfigOrder(config.sorter ?? 1)
        this.checkuser = new ConfigUrlCheckUser(config.url_check_user ?? '')
        this.icon = new ConfigIcon(config.icon ?? '')
    }

    validate() {
        Object.values(this).forEach(v => {
            if (v instanceof InputFiled) {
                v.validate()
            }
        })
    }

    toConfig() {
        const config = new ConfigModel()
        config.mode = this.mode.getSelected().value
        config.name = this.name.getValue()
        config.description = this.desc.getValue()
        config.category_id = parseInt(this.category.getSelected().value)
        config.sorter = this.order.getValue()
        config.url_check_user = this.checkuser.getValue()
        config.icon = this.icon.getValue()
        return config
    }

    createDivWithClass(...elements) {
        const div = document.createElement('div')
        div.classList.add('d-flex', 'gap-2')
        elements.forEach(element => div.appendChild(element))
        return div
    }

    render() {
        this._element.innerHTML = ''

        this._element.appendChild(this.mode.render())
        this._element.appendChild(this.createDivWithClass(this.name.render(), this.desc.render()))
        this._element.appendChild(this.createDivWithClass(this.category.render(), this.order.render()))
        this._element.appendChild(this.createDivWithClass(this.icon.render(), this.checkuser.render()))

        return this._element
    }
}

class ConfigFormSshDirect extends ConfigForm {
    constructor(config, categories) {
        super(config, categories)
        this.payload = new ConfigPayload(config?.config_payload?.payload || '')
        this.server = new ConfigServer(config?.server?.host || '')
        this.serverPort = new ConfigPort(config?.server?.port || 80)
        this.dns1 = new ConfigDns1(config?.dns_server?.dns1 || '8.8.8.8')
        this.dns2 = new ConfigDns2(config?.dns_server?.dns2 || '8.8.4.4')
        this.username = new ConfigUsername(config?.auth?.username || '')
        this.password = new ConfigPassword(config?.auth?.password || '')
        this.udpPort = new ConfigUdpPort(config.udp_ports || 7300)
    }

    toConfig() {
        const config = super.toConfig()
        config.config_payload = { payload: this.payload.getValue() }
        config.server = { host: this.server.getValue(), port: this.serverPort.getValue() }
        config.dns_server = { dns1: this.dns1.getValue(), dns2: this.dns2.getValue() }
        config.auth = { username: this.username.getValue(), password: this.password.getValue() }
        config.udp_ports = this.udpPort.getValue().split(',').map(p => parseInt(p))
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.payload.render(), element.childNodes[3])
        element.insertBefore(this.udpPort.render(), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.username.render(), this.password.render()), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.dns1.render(), this.dns2.render()), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.server.render(), this.serverPort.render()), element.childNodes[4])
        return element
    }
}

class ConfigFormSshProxy extends ConfigFormSshDirect {
    constructor(config, categories) {
        super(config, categories)
        this.proxy = new ConfigProxy(config?.proxy?.host || '')
        this.proxyPort = new ConfigPort(config?.proxy?.port || 80)
    }

    toConfig() {
        const config = super.toConfig()
        config.proxy = { host: this.proxy.getValue(), port: this.proxyPort.getValue() }
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(
            this.createDivWithClass(this.proxy.render(), this.proxyPort.render()),
            element.childNodes[4]
        )
        return element
    }
}

class ConfigFormSslDirect extends ConfigForm {
    constructor(config, categories) {
        super(config, categories)
        this.sni = new ConfigSni(config?.config_payload?.sni || '')
        this.server = new ConfigServer(config?.server?.host || '')
        this.serverPort = new ConfigPort(config?.server?.port || 80)
        this.dns1 = new ConfigDns1(config?.dns_server?.dns1 || '8.8.8.8')
        this.dns2 = new ConfigDns2(config?.dns_server?.dns2 || '8.8.4.4')
        this.username = new ConfigUsername(config?.auth?.username || '')
        this.password = new ConfigPassword(config?.auth?.password || '')

        this.tlsVersion = new ConfigTlsVersion(['TLSv1.3', 'TLSv1.2', 'TLSv1.1'])
        this.tlsVersion.setSelected(config.tls_version)

        this.udpPort = new ConfigUdpPort(config.udp_ports || 7300)
    }

    toConfig() {
        const config = super.toConfig()
        config.config_payload = { sni: this.sni.getValue() }
        config.server = { host: this.server.getValue(), port: this.serverPort.getValue() }
        config.dns_server = { dns1: this.dns1.getValue(), dns2: this.dns2.getValue() }
        config.auth = { username: this.username.getValue(), password: this.password.getValue() }
        config.tls_version = this.tlsVersion.getSelected().value;
        config.udp_ports = this.udpPort.getValue().split(',').map(p => parseInt(p))
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.createDivWithClass(this.sni.render(), this.tlsVersion.render()), element.childNodes[3])
        element.insertBefore(this.udpPort.render(), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.username.render(), this.password.render()), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.dns1.render(), this.dns2.render()), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.server.render(), this.serverPort.render()), element.childNodes[4])
        return element
    }
}

class ConfigFormSslProxy extends ConfigFormSslDirect {
    constructor(config, categories) {
        super(config, categories)
        this.payload = new ConfigPayload(config?.config_payload?.payload || '')
        this.proxy = new ConfigProxy(config?.proxy?.host || '')
        this.proxyPort = new ConfigPort(config?.proxy?.port || 80)
    }

    toConfig() {
        const config = super.toConfig()
        config.config_payload.payload = this.payload.getValue();
        config.proxy = { host: this.proxy.getValue(), port: this.proxyPort.getValue() }
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.payload.render(), element.childNodes[3])
        element.insertBefore(
            this.createDivWithClass(this.proxy.render(), this.proxyPort.render()),
            element.childNodes[5]
        )
        return element
    }
}

class ConfigFormOpenVPN extends ConfigForm {
    constructor(config, categories) {
        super(config, categories)
        this.openvpn = new ConfigOpenVPN(config.config_openvpn ?? '')
        this.proxy = new ConfigProxy(config?.proxy?.host || '')
        this.proxyPort = new ConfigPort(config?.proxy?.port || 80)
        this.dns1 = new ConfigDns1(config?.dns_server?.dns1 || '8.8.8.8')
        this.dns2 = new ConfigDns2(config?.dns_server?.dns2 || '8.8.8.8')
        this.username = new ConfigUsername(config?.auth?.username || '')
        this.password = new ConfigPassword(config?.auth?.password || '')
    }

    toConfig() {
        const config = super.toConfig()
        config.config_openvpn = this.openvpn.getValue()
        config.proxy = { host: this.proxy.getValue(), port: this.proxyPort.getValue() }
        config.dns_server = { dns1: this.dns1.getValue(), dns2: this.dns2.getValue() }
        config.auth = { username: this.username.getValue(), password: this.password.getValue() }
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.openvpn.render(), element.childNodes[3])
        element.insertBefore(this.createDivWithClass(this.username.render(), this.password.render()), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.dns1.render(), this.dns2.render()), element.childNodes[4])
        element.insertBefore(this.createDivWithClass(this.proxy.render(), this.proxyPort.render()), element.childNodes[4])
        return element
    }
}

class ConfigFormOpenVPNProxy extends ConfigFormOpenVPN {
    constructor(config, categories) {
        super(config, categories)
        this.payload = new ConfigPayload(config?.config_payload?.payload || '')
    }

    toConfig() {
        const config = super.toConfig()
        config.config_payload = { payload: this.payload.getValue() }
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.payload.render(), element.childNodes[4])
        return element
    }
}

class ConfigFormOpenVPNSsl extends ConfigFormOpenVPN {
    constructor(config, categories) {
        super(config, categories)
        this.sni = new ConfigSni(config?.config_payload?.sni || '')
        this.tlsVersion = new ConfigTlsVersion(['TLSv1.3', 'TLSv1.2', 'TLSv1.1'])
        this.tlsVersion.setSelected(config.tls_version)
    }

    toConfig() {
        const config = super.toConfig()
        config.config_payload = { sni: this.sni.getValue() }
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.createDivWithClass(this.sni.render(), this.tlsVersion.render()), element.childNodes[4])
        return element
    }
}

class ConfigFormOpenVPNSslProxy extends ConfigFormOpenVPNSsl {
    constructor(config, categories) {
        super(config, categories)
        this.payload = new ConfigPayload(config?.config_payload?.payload || '')
    }

    render() {
        const element = super.render()
        element.insertBefore(this.payload.render(), element.childNodes[4])
        return element
    }

    toConfig() {
        const config = super.toConfig()
        config.config_payload.payload = this.payload.getValue()
        return config
    }
}

class ConfigFormV2ray extends ConfigForm {
    constructor(config, categories) {
        super(config, categories)
        this.v2ray = new ConfigV2ray(config.config_v2ray || '')
        this.uuid = new ConfigUuid(config?.auth?.v2ray_uuid || '')
    }

    toConfig() {
        const config = super.toConfig()
        config.config_v2ray = this.v2ray.getValue()
        config.auth = { v2ray_uuid: this.uuid.getValue() }
        return config
    }

    render() {
        const element = super.render()
        element.insertBefore(this.v2ray.render(), element.childNodes[3])
        element.insertBefore(this.uuid.render(), element.childNodes[4])
        return element
    }
}

export class ConfigFormFactory {
    static create(type, config, categories) {
        const __map = {
            SSH_DIRECT: ConfigFormSshDirect,
            SSH_PROXY: ConfigFormSshProxy,
            SSL_DIRECT: ConfigFormSslDirect,
            SSL_PROXY: ConfigFormSslProxy,
            OVPN_PROXY: ConfigFormOpenVPNProxy,
            OVPN_SSL: ConfigFormOpenVPNSsl,
            OVPN_SSL_PROXY: ConfigFormOpenVPNSslProxy,
            V2RAY: ConfigFormV2ray,
        }
        return new __map[type](config, categories)
    }
}