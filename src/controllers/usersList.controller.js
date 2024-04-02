import * as userServices from "../services/user.service.js"
import { Router } from "express";
import { uploader } from "../utilitis.js";
import * as emailService from "../services/email.service.js";


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

///////ELIMINAR USUARIOS INACTIVOS
router.delete("/", async (req, res) => {
    try {
        const users = await userServices.getAll();
        let fechaActual = new Date();
        let inactividad = true;
        //Tiempo en minutos, prueba 30, 2 días = 2880 minutos
        let tiempoMaximoInactividadMinutos = 2880;
        let modoPrueba = false;
        //Modo prueba setea el tiempo en 30 minutos y muestra si el usuario esta inactivo en vez de eliminarlo
        if (modoPrueba) {
            tiempoMaximoInactividadMinutos = 30;
        }
        users.forEach(async function (usuario) {
            let lastConnection = new Date(usuario.last_connection);
            console.log(lastConnection)
            let diferenciaTiempo = fechaActual - lastConnection;
            console.log(diferenciaTiempo)
            let diferenciaMinutos = diferenciaTiempo / (1000 * 60);
            console.log(diferenciaMinutos)
            // Verificar si la diferencia es menor a la seteada
            console.log(tiempoMaximoInactividadMinutos)
            if (diferenciaMinutos < tiempoMaximoInactividadMinutos) {
                if (modoPrueba) {
                    console.log(usuario);
                    console.log("El usuario está activo.");
                    console.log("----------------");
                }
                console.log("Usuario activo");
            } else {
                if (modoPrueba) {
                    console.log(usuario);
                    console.log("El usuario está inactivo.");
                    console.log("----------------");
                } else {
                    let notification = emailService.sendNotification(usuario.email, inactividad);
                    let result = await userServices.deleteUser(usuario.email);
                    console.log("Usuario inactivo eliminado");
                };
            };
        });
        const newUserList = await userServices.getAll();
        res.render('usersList', {
            users: newUserList,
            title: "Listado de Usuarios",
            rolActualizado: false,
            usuarioEliminado: true
        })
    } catch (error) {
        res.status(500).send('Error al eliminar usuarios: ' + error.message);
    }
});


///ELIMINAR USUARIO POR EMAIL

router.delete("/:uid", async (req, res) => {
    const email = req.params.uid;
    console.log("Usuario a eliminar: ",email);
    try {
        let inactividad = false;
        const user = await userServices.deleteUser(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        };
        let notification = emailService.sendNotification(email, inactividad);
        let result = await userServices.deleteUser(email);
        const users = await userServices.getAll();
        res.render('usersList', {
            users: users,
            title: "Listado de Usuarios",
            rolActualizado: false,
            usuarioEliminado: true
        })
    }catch (error) {
        res.status(500).send('Error al eliminar usuario: ' + error.message);
    }
});

/////Cambiar rol de usuario
router.post("/premium/:uid", async (req, res) => {
    const role = req.body.role;
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




router.post("/premium/:uid/documents", uploader.array(), async function (req, res) {
    try {
        console.log("Entro en documentos");
        // Obtener el ID del usuario desde la solicitud (supongamos que está en req.userId)
        const email = req.params.uid;
        // Array para almacenar los objetos de documentos
        let documentos = [];
        // Variable para controlar si ya se ha encontrado un documento 'profile'
        let profileFound = false;
        // Iterar sobre los archivos recibidos
        for (const file of req.files) {
            // Crear objeto con propiedades name y reference
            let documento = {
                name: file.originalname, // Nombre del archivo
                reference: file.filename // Enlace al documento
            };
            // Verificar si el nombre del archivo comienza con 'profile'
            if (file.fieldname === 'perfil') {
                // Si ya se ha encontrado un documento 'profile', no se agrega al array
                if (profileFound) continue;
                // Consultar si el usuario ya tiene un documento 'profile' en su propiedad documents
                const user = await userServices.getOne(email);
                const profileIndex = user.documents.findIndex(doc => doc.name.startsWith('profile'));
                if (profileIndex !== -1) {
                    // Si ya hay un documento 'profile', se reemplaza en el array
                    user.documents[profileIndex] = documento;
                    profileFound = true;
                    continue;
                }
                // Si no se ha encontrado un documento 'profile' y el usuario no tiene uno en su propiedad documents, se agrega al array
                documentos.push(documento);
                profileFound = true;
            } else {
                // Si el archivo no es un documento 'profile', se agrega al array
                documentos.push(documento);
            }
        }
        // Obtener el usuario
        const user = await userServices.getOne(email);
        // Actualizar la propiedad documents del usuario
        user.documents = documentos;
        // Guardar el usuario actualizado en la base de datos
        await user.save();
        // Enviar respuesta al cliente
        res.send('Archivos subidos correctamente.').redirect("/api/sessions/current");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
});


export default router;