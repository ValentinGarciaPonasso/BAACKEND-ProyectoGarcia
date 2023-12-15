import express from 'express';
import { logOut, loginUser, registerUser } from '../controllers/auth.controller.js';
import { showProfile } from '../controllers/user.controller.js';
import passport from "passport";

const sessionRouter = express.Router();

// sessionRouter.post("/register", registerUser);
// sessionRouter.post("/login", loginUser);
sessionRouter.post("/profile", showProfile);
sessionRouter.post("/logout", logOut);

sessionRouter.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/" }),
    async (req, res) => {
        let user = req.user;
        delete user.password;
        req.session.name = user.first_name;
        req.session.email = user.email;
        req.session.admin = user.admin;
        console.log("Usuario registrado:", req.session);
        res.redirect("/products");
    }
);

sessionRouter.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/" }),
    async (req, res) => {
        let user = req.user;
        if (!user)
            return res
                .status(400)
                .send({ status: "Error", error: "Inalid Credentials" });
        delete user.password;
        req.session.name = user.first_name;
        req.session.email = user.email;
        req.session.admin = user.admin;
        console.log("Usuario autenticado:", req.session);
        res.redirect("/products");
    }
);

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
        req.session.admin = user.admin;
        console.log("Usuario autenticado:", req.session);
        res.redirect("/products");
    }
)

export default sessionRouter;