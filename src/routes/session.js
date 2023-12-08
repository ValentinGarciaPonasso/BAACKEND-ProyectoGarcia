import express from 'express';
import {logOut, loginUser, registerUser} from '../controllers/auth.controller.js';
import {showProfile} from '../controllers/user.controller.js';

const sessionRouter = express.Router ();

sessionRouter.post("/register", registerUser);
sessionRouter.post("/login", loginUser);
sessionRouter.post("/profile", showProfile);
sessionRouter.get("/", logOut);

export default sessionRouter;