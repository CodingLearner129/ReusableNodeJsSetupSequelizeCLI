// import configJs from '../config/config.js';
    // code created by me
// const getMessage = async (key = null, replace = {}, locale = configJs.CONFIG.locale) => {
//     if (!key) {
//         return key;
//     }
//     key = key.split('.');
//     const filePath = `./../lang/${locale}/${key[0]}.js`;
//     key.shift(); // Remove the first element
//     let file;
//     try {
//         file = await import(filePath);
//     } catch (error) {
//         console.error(`Error loading translation file ${filePath}:`, error);
//         return '';
//     }

//     let temp = file.default;
//     for (const element of key) {
//         if (!temp || !temp[element]) {
//             console.error(`Translation key ${key.join('.')} not found in file ${filePath}`);
//             return '';
//         }
//         temp = temp[element];
//     }
//     return temp;
// };

// export default getMessage;


import configJs from './../config/config.js';
    // my code optimized by Chat GPT
const translationCache = {}; // Cache for imported translation files

const loadTranslationFile = async (fileName, locale, replace) => {
    const filePath = `./../lang/${locale}/${fileName}.js`;
    try {
        const file = await import(filePath);

        // // Replace data in the loaded file if replacements exist
        // if (file && typeof file.default === 'object' && Object.keys(replace).length > 0) {
        //     for (const [key, value] of Object.entries(replace)) {
        //         file.default[key] = value;
        //     }
        // }

        translationCache[`${fileName}-${locale}`] = file.default;
        return file.default;
    } catch (error) {
        console.error(`Error loading translation file ${filePath}:`, error);
        return null;
    }
};

const getTranslation = async (keys, file) => {
    const key = keys.shift();
    if (!file || !file[key]) {
        console.error(`Translation key ${keys.join('.')} not found`);
        return '';
    }
    if (keys.length === 0) {
        return file[key];
    }
    return getTranslation(keys, file[key]);
};

const getMessage = async (key = null, replace = {}, locale = configJs.CONFIG.locale) => {
    if (!key) {
        return key;
    }

    const keys = key.split('.');
    const fileName = keys.shift();

    const cacheKey = `${fileName}-${locale}`;
    const file = translationCache[cacheKey] || await loadTranslationFile(fileName, locale, replace);

    if (!file) {
        return '';
    }

    // return await getTranslation(keys, file);
    let message = await getTranslation(keys, file);

    // Replace placeholders in the message
    for (const [placeholder, value] of Object.entries(replace)) {
        if (placeholder) {
            message = message.replace(new RegExp(`:${placeholder}`, 'g'), value);
        }
    }

    return message;
};

export default getMessage;
