import {fileURLToPath}  from 'url';
import {dirname} from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './src/public/img')
    },
    filename: (req, file, cb) => {
        const tiimestamp = Date.now();
        const originName = file.originalname;
        const extension= originName.split('.').pop();
        const filename = `${tiimestamp}-clase8.${extension}`;
        cb(null, filename);
    }
});

export const uploader = multer({storage});

const _filename = fileURLToPath (import.meta.url);
const _dirname = dirname(_filename);

export default _dirname;