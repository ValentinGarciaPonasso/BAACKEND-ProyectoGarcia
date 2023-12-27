import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import passport from "passport";

export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
    bcrypt.compareSync(password, user.password);

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './src/public/img')
    },
    filename: (req, file, cb) => {
        const tiimestamp = Date.now();
        const originName = file.originalname;
        const extension = originName.split('.').pop();
        const filename = `${tiimestamp}-clase8.${extension}`;
        cb(null, filename);
    }
});

export const uploader = multer({ storage });

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

export default _dirname;


////AGREGAMOS JWT
const PRIVATE_KEY = process.env.KEYSECRET;

export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1d" });
    return token;
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res
                    .status(401)
                    .send({ error: info.messages?.info, messages: info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};