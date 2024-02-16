import { Router } from "express";
import * as recoveryService from "../services/recovery.service.js";
import * as userServices from "../services/user.service.js"
import {createHash,isValidPassword} from "../utilitis.js";

const router = new Router();

router.get('/', (req, res) => {
    const recover = false;
    res.render('recoveryPassword', {
        title: "Recuperacion de contraseña",
        actionRecover: "/api/recoverPass",
        recover: recover
    });
})

router.post("/", async (req, res) => {
    try {
        const to = req.body.email;     
        const email = to
        console.log(to);
        let findUser = await userServices.getOne(email);
        console.log(findUser);
        if (!findUser) {
            return res.status(400).send({
                status: "error",
                error: "No se encontró usuario asociado al email ingresado",
            });
        } else {
            const userInfo = {
                _id: findUser._id,
                email: findUser.email
            }
            const recovery = await recoveryService.createRecovery(to, userInfo);
            res.status(200).json({ message: "Email de recuperacion enviado"})
        }
    } catch (error) {
        res.status(500).send('Error al enviar mail de recuperación: ' + error.message);
    }
});

router.get('/change/:hash', async (req, res) => {
    try {        
        let hash = req.params.hash;
        const recovery = await recoveryService.getRecovery(hash);
        console.log("Recovery obtenido: ",recovery)
        ////Evaluamos si el mail se encuentra expirado
        let fechaActual = new Date();
        let expirado = recovery.fechaExpiracion < fechaActual;
        if(expirado){
            const recover = false;
            res.render('recoveryPassword', {
                title: "Recuperacion de contraseña",
                actionRecover: "/api/recoverPass",
                recover: recover,
                expirado: expirado
            })
        } else {
            const userEmail = recovery.username.email
            const recover = true;
            res.render('recoveryPassword', {
                title: "Cambio de contraseña",
                actionChange: "/api/recoverPass/change",
                email: userEmail,
                recover: recover
            });
        }
    } catch (error) {
        res.status(500).send('Error al procesar el mail de recuperación: ' + error.message);
    }
})

router.post('/change', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    ///Evaluamos que no use la misma contraseña
    const password = req.body.password;
    let user = await userServices.getOne(email)
    if (isValidPassword(user, password)){
        return res.status(401).send({
            status: "error",
            error: "No puede repetir la contraseña"
        })
    }
    const hashedPassword = createHash(password)
    try {
        const user = await userServices.modifyPass(hashedPassword, email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        };
        let change = true;
        console.log(user + " change " + change);
        let data = {
            layout: "login",
            title: "Inicio de sesión",
            title_register: "Registro",
            actionRegister: "/api/sessions/register/",
            actionLogin: "/api/sessions/login/",
            change: change
        };
        res.render('index', data);
    } catch (error) {
        res.status(500).send('Error al actualizar contraseña: ' + error.message);
    }
})

export default router