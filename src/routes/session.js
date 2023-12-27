import express from 'express';
import { logOut, loginUser, registerUser } from '../controllers/auth.controller.js';
import { showProfile } from '../controllers/user.controller.js';
import { passportCall, createHash, generateToken, isValidPassword } from '../utilitis.js';
import passport from "passport";
import userModel from "../dao/models/user.model.js";

const sessionRouter = express.Router();

// sessionRouter.post("/register", registerUser);
// sessionRouter.post("/login", loginUser);
sessionRouter.post("/profile", showProfile);
sessionRouter.post("/logout", logOut);

////CON SESSISON
// sessionRouter.post(
//     "/register",
//     passport.authenticate("register", { failureRedirect: "/" }),
//     async (req, res) => {
//         let user = req.user;
//         delete user.password;
//         req.session.name = user.first_name;
//         req.session.email = user.email;
//         req.session.role = user.role;
//         console.log("Usuario registrado:", req.session);
//         res.redirect("/products");
//     }
// );

// sessionRouter.post(
//     "/login",
//     passport.authenticate("login", { failureRedirect: "/" }),
//     async (req, res) => {
//         let user = req.user;
//         if (!user)
//             return res
//                 .status(400)
//                 .send({ status: "Error", error: "Inalid Credentials" });
//         delete user.password;
//         req.session.name = user.first_name;
//         req.session.email = user.email;
//         req.session.role = user.role;
//         console.log("Usuario autenticado:", req.session);
//         res.redirect("/products");
//     }
// );


//CON JWT

sessionRouter.post("/register", async (req,res) => {
    const {first_name,last_name, email, age, password} = req.body;

    if(!first_name || !last_name || !email || !age || !password) 
        return res
            .status(400)
            .send({status: "Error", Error: "Uno o varios datos incompletos"})

    const findUser= await userModel.findOne({email});
    let result = null;
    if(findUser) {
        return res.status(400).send({
            status:"error",
            error: "Intenta hacer login con usuario y contraseña",
        });
    } else {
        result = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age,
            password: createHash(password)
        });
    }
    res.redirect("/api/sessions/current");
});

sessionRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne(
            {email}, 
            {email:1, first_name:1,last_name: 1, age:1, password:1, role:1}
        );
        if(!user) 
            return res.status(401).send({
                status: "error", 
                error:"Usuario y/o contraseña incorrecta 1",
            });

        if(!isValidPassword (user, password))
            return res.status(401).send({
                status: "error",
                error:"Usuario y/o contraseña incorrecta 2"
            })

        delete user.password
        let token = generateToken(user);

        res
            .cookie("access_token", token, {
                maxAge: 60*60*1000,
                httpOnly: true,
        })
            .redirect("/api/sessions/current");
    } catch (error) {
        console.log("Error credenciales inválidas")
        res.redirect("/error");
    }
})

sessionRouter.get('/current', passportCall ('jwt'), (req, res) => {
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

sessionRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user: email"] }),
    async (req, res) => { }
);


sessionRouter.get(
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
)

export default sessionRouter;