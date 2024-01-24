import * as userServices from "../services/user.service.js"
import {Router} from "express";
import "dotenv/config.js";
import { passportCall, createHash, generateToken, isValidPassword } from "../utilitis.js";
import passport from "passport";
import { logOut} from '../controllers/auth.controller.js';


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
            return res
                .status(400)
                .send({ status: "Error", Error: "Uno o varios datos incompletos" })

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
                password: createHash(password)
            };
            let result = await userServices.create(newUser)
        }
        let user = await userServices.getOne(email)
        console.log("prueba de user" + user)
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
            console.log("Usuario desde sesion: " + user);
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
            let token = generateToken(user);
    
            res
                .cookie("access_token", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true,
                })
                .redirect("/api/sessions/current");
        };
    } catch (error) {
        console.log("Error credenciales inválidas", error);
        return res.redirect("/");
    }
});

//Logut(hacer se encuentra a medias)

router.post("/logout", logOut);

///SESION CURRENT Y GITHUB

router.get('/current', passportCall ('jwt'), (req, res) => {
    let userData = req.user.user;
    console.log("Usuario dese current: " + userData);
    let admin = false;
    if (userData.role === 'admin') {
        admin = true;
    }
    res
        .status(200)
        // // .send(req.user)
        .render('current', {
            user: userData,
            admin: admin,
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
        console.log("Usuario desde Session: ", user);
        req.session.name = user.first_name;
        req.session.email = user.email;
        req.session.role = user.role;
        console.log("Usuario autenticado:", req.session);
        res.redirect("/products");
    }
);


export default router;