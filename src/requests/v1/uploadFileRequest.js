import multer from "multer";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import getMessage from "../../helpers/getMessage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(path.join(__dirname, './../../public/images'))) {
            fs.mkdirSync(path.join(__dirname, './../../public/images'));
        }
        cb(null, path.join(__dirname, './../../public/images'));
    },
    filename: function (req, file, cb) {
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
    }
});

const multerFilter = async (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // cb(error, true/false); // To accept the file pass `true`
    } else {
        cb(new Error(await getMessage('validation.image.image')), false); // cb(error, true/false); // To reject this file pass `false`
    }
}

const upload = multer({
    storage,
    fileFilter: multerFilter,
    onError: function (err, next) {
        next(err);
    }
});

export const uploadImage = (req, res, next) => {
    const uploadedImage = upload.single('image');
    uploadedImage(req, res, function (err) {
        if (err) {
            return res.status(200).json({
                status: false,
                message: err,
            });
        }
        next();
    });
}