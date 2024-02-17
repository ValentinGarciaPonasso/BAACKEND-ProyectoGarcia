import * as userServices from "../services/user.service.js"
import {Router} from "express";


const router = new Router();



///////LISTADO DE USUARIOS
router.get("/", async (req, res) => {
    try {
        const users = await userServices.getAll();
        res.render('usersList', {
            users: users,
            title: "Listado de Usuarios",
            rolActualizado: false
        })
    } catch (error) {
        res.status(500).send('Error al obtener productos: ' + error.message);
    }
});

/////Cambiar rol de usuario
router.post ("/premium/:uid" , async (req, res) => {
    const  role = req.body.role;
    const email = req.params.uid;
    console.log("Rol desde premium: " + role)
    console.log("Email desde premium: " + email)
    try {
        const user = await userServices.modfyRole(role, email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        };
        const users = await userServices.getAll();
        res.render('usersList', {
            users: users,
            title: "Listado de Usuarios",
            rolActualizado: true,
        })
    } catch (error) {
        res.status(500).send('Error al actualizar rol: ' + error.message);
    }
});


export default router;