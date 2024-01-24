// import express from 'express';
// import { logOut, /*loginUser, registerUser*/ } from '../controllers/auth.controller.js';
// import { showProfile } from '../controllers/user.controller.js';
// import { passportCall, createHash, generateToken, isValidPassword } from '../utilitis.js';
// // import { registerUser, loginUser } from '../controllers/user.controller.js';
// import passport from "passport";
// import userModel from "../dao/models/user.model.js";
// import "dotenv/config.js"

// const sessionRouter = express.Router();

// sessionRouter.post("/profile", showProfile);

// sessionRouter.post("/logout", logOut);
// // sessionRouter.post("/register", registerUser);
// // sessionRouter.post("/login", loginUser);


// // sessionRouter.get('/current', passportCall ('jwt'), (req, res) => {
// //     let userData = req.user.user;
// //     console.log("Usuario dese current: " + userData);
// //     let admin = false;
// //     if (userData.role === 'admin') {
// //         admin = true;
// //     }
// //     res
// //         .status(200)
// //         // // .send(req.user)
// //         .render('current', {
// //             user: userData,
// //             admin: admin,
// //             title: "Current",
// //         })
// // });

// // ///CONEXION CON GITHUB:

// // sessionRouter.get(
// //     "/github",
// //     passport.authenticate("github", { scope: ["user: email"] }),
// //     async (req, res) => { }
// // );


// // sessionRouter.get(
// //     "/githubcallback",
// //     passport.authenticate("github", { failureRedirect: "/" }),
// //     async (req, res) => {
// //         let user = req.user;
// //         console.log("Usuario desde Session: ", user);
// //         req.session.name = user.first_name;
// //         req.session.email = user.email;
// //         req.session.role = user.role;
// //         console.log("Usuario autenticado:", req.session);
// //         res.redirect("/products");
// //     }
// // );

// export default sessionRouter;