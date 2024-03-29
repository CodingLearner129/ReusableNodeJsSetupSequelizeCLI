import fs from 'fs';

export const getImage = (image) => {
    if (image) {
        // read binary data
        let bitmap = fs.readFileSync(`./src/public/${image}`);
        // Extract file extension
        const fileExtension = image.split('.').pop().toLowerCase();
        // convert binary data to base64 encoded string and update the image property
        return `data:image/${fileExtension};base64,${Buffer.from(bitmap).toString('base64')}`;
    } else {
        return '';
    }
}