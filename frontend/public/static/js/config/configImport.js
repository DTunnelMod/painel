class ConfigImport {
    async import(content) {
        const body = {
            items: JSON.parse(content),
        }
        const response = await fetch('/app_config/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (response.status != 201) throw new Error(data.message);
    }

    static create() {
        return new ConfigImport();
    }
}

class ConfigLoaderFile {
    async load(file) {
        const reader = new FileReader();
        const result = await new Promise((resolve, reject) => {
            reader.onload = (e) => {
                const content = e.target.result;
                resolve(content);
            };
            reader.onerror = (e) => {
                reject(e);
            };
            reader.readAsText(file);
        });
        return result;
    }
}

class ConfigLoaderUrl {
    async load(url) {
        const result = await fetch(url).then(r => r.json());
        return Array.isArray(result) ? result : [result];
    }
}

class ConfigLoaderFactory {
    static create(type) {
        switch (type) {
            case 'FILE':
                return new ConfigLoaderFile();
            case 'LINK':
                return new ConfigLoaderUrl();
            default:
                throw new Error('Tipo de importação inválido!');
        }
    }
}

export { ConfigLoaderFactory, ConfigImport }