import * as userServices from "../services/user.service.js"
import {Router} from "express";
import "dotenv/config.js";
import { passportCall, createHash, generateToken, isValidPassword } from "../utilitis.js";
import passport from "passport";
import { logOut} from '../controllers/auth.controller.js';
import { generateUserErrorInfo } from "../errors/info.error.js";
import CustomError from "../errors/custom.error.js";
import EnumError from "../errors/enum.error.js";


const router = new Router();

const showProfile = (req, res) => {
    const { user } = req.session.user;
    res.render('profile', { user });
};

export { showProfile };


//Register
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password)
            {
                CustomError.createError({
                    name: "Product creation error",
                    cause: generateUserErrorInfo({first_name, last_name ,email ,age ,password}),
                    message: "Error trying to create a new product",
                    code: EnumError.INVALID_TYPES_ERROR
                })
            }

        let findUser = await userServices.getOne(email);
        let newUser = null;
        if (findUser) {
            return res.status(400).send({
                status: "error",
                error: "Intenta hacer login con usuario y contraseña",
            });
        } else {
            newUser = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                age: age,
                password: createHash(password),
                last_connection: new Date()
            };
            let result = await userServices.create(newUser)
        }
        let user = await userServices.getOne(email)
        let token = generateToken(user);
        res
        .cookie("access_token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        })
        .redirect('/api/cart/createCart');
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
});

//Login



router.post ("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        ///condicional para superadmin
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const user = {
                first_name: "SuperAdmin",
                last_name: "SuperAdmin",
                email: email,
                age: 99,
                password: password,
                role: "admin"
            }
            let token = generateToken(user);
            res
                .cookie("access_token", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
                .redirect("/api/sessions/current");
        }else {
            let user = await userServices.getOne(email)
            req.logger.info("Usuario desde sesion: " + user);
            //console.log("Usuario desde sesion: " + user);
            if (!user)
                return res.status(401).send({
                    status: "error",
                    error: "Usuario y/o contraseña incorrecta 1",
                });
    
            if (!isValidPassword(user, password))
                return res.status(401).send({
                    status: "error",
                    error: "Usuario y/o contraseña incorrecta 2"
                })
            delete user.password
            let connectionTime = new Date();
            let result = await userServices.modifyConection (connectionTime, email);

            let token = generateToken(user);
    
            res
                .cookie("access_token", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
                .redirect("/api/sessions/current");
        };
    } catch (error) {
        req.logger.error("Error credenciales inválidas", error);
        return res.redirect("/");
    }
});

//Logut

router.post("/logout", logOut);

///SESION CURRENT Y GITHUB

router.get('/current', passportCall ('jwt'), (req, res) => {
    let userData = req.user.user;
    req.logger.info("Acceso correcto a current");
    let admin = false;
    let isAdmin = false;
    if (userData.role === 'admin' || userData.role === 'premium') {
        admin = true;
        if(userData.role === 'admin'){
            isAdmin = true;
        }
    }
    res
        .status(200)
        // // .send(req.user)
        .render('current', {
            user: userData,
            admin: admin,
            isAdmin: isAdmin,
            title: "Current",
        })
});

///CONEXION CON GITHUB:

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user: email"] }),
    async (req, res) => { }
);


router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/" }),
    async (req, res) => {
        let user = req.user;
        req.logger.info("Usuario desde Session: ", user);
        //console.log("Usuario desde Session: ", user);
        req.session.name = user.first_name;
        req.session.email = user.email;
        req.session.role = user.role;
        req.logger.info("Usuario autenticado:", req.session);
        //console.log("Usuario autenticado:", req.session);
        res.redirect("/products");
    }
);


export default router;