
const configFileName = "../config.json";
const configData = require(configFileName);

export function getConfig(key: string, defaultValue: any): any {
    if (!configData) {
        console.log(`Missing config, config file: ${configFileName}`);
        return defaultValue;
    }
    if (!(key in configData)) {
        console.log(`Missing config entry, key ${key}, config file: ${configFileName}`);
        return defaultValue;
    }
    return configData[key];
}
