class Type {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    convert() {
        throw new Error('Not implemented');
    }

    static create(name, value) {
        switch (name.toUpperCase()) {
            case 'COLOR':
                return new ColorType(name, value);
            case 'URL':
                return new UrlType(name, value);
            case 'IMAGE':
                return new ImageType(name, value);
            case 'BOOLEAN':
                return new BooleanType(name, value);
            case 'INTEGER':
                return new IntegerType(name, value);
            case 'TEXT':
                return new TextType(name, value);
            case 'STRING':
                return new StringType(name, value);
            case 'SELECT':
                return new SelectType(name, value);
            case 'HTML':
                return new HtmlType(name, value);
            default:
                return new StringType(name, value);
        }
    }
}

class BooleanType extends Type {
    convert() {
        return String(this.value).toUpperCase() === 'TRUE';
    }
}

class ColorType extends Type {
    convert() {
        return this.value;
    }
}

class UrlType extends Type {
    convert() {
        try {
            new URL(this.value);
            return this.value;
        } catch (e) {
            return null;
        }
    }
}

class ImageType extends Type {
    convert() {
        try {
            new URL(this.value);
            return this.value;
        } catch (e) {
            return null;
        }
    }
}

class IntegerType extends Type {
    convert() {
        return parseInt(this.value);
    }
}

class TextType extends Type {
    convert() {
        return this.value == '' ? null : this.value;
    }
}

class StringType extends Type {
    convert() {
        return this.value == '' ? null : this.value;
    }
}

class SelectType extends Type {
    convert() {
        return this.value;
    }
}

class HtmlType extends Type {
    convert() {
        return this.value == '' ? null : this.value;
    }
}

const Status = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
}

class AppConfigModel {
    id;
    label;
    name;
    value;
    type;
    userId;

    static fromJson(data) {
        const model = new AppConfigModel();
        const type = Type.create(data.type, data.value);
        model.id = data.id;
        model.label = data.label;
        model.name = data.name;
        model.type = type.name;
        model.value = type.convert();
        model.userId = data.user_id;
        return model;
    }

    static fromJsonList(data) {
        return data.map(AppConfigModel.fromJson);
    }

    toJson() {
        const type = Type.create(this.type, this.value)

        return {
            id: this.id,
            label: this.label,
            name: this.name,
            value: type.convert(),
            type: type.name,
            user_id: this.userId,
        }
    }
}

class AppConfig {
    id;
    listeners = [];
    _items = [];

    get items() {
        return this._items;
    }

    get userId() {
        return this._items[0].userId;
    }

    set items(value) {
        this._items = value;
        this._items.forEach(item => {
            Object.defineProperty(this, item.name.toLowerCase(), {
                get: () => item.value,
                set: value => {
                    item.value = value;
                    this.notify();
                },
                enumerable: true,
                configurable: true,
            });
        });
    }

    observe(listener) {
        this.listeners.push(listener);
        this.notify();
    }

    notify() {
        this.listeners.forEach(listener => listener(this));
    }

    static fromJson(data) {
        const model = new AppConfig();
        model.id = data.id;
        model.items = AppConfigModel.fromJsonList(data.app_config);
        return model;
    }

    get(name) {
        return this.items.find(item => item.name.toUpperCase() === name.toUpperCase());
    }

    set(name, value) {
        const item = this.items.find(item => item.name.toUpperCase() === name.toUpperCase());
        if (item) item.value = value;
        this.notify();
    }

    toJson() {
        const data = {
            id: this.id,
            app_config: this.items.map(item => item.toJson()),
        }
        return JSON.stringify(data, null, 4);
    }
}

export { AppConfigModel, Status, Type };
export default AppConfig;