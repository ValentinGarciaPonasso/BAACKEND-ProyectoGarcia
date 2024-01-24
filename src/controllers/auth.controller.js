import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utilitis.js";


export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        //VALIDAMOS CAMPOS VACIOS
        if (!first_name || last_name || !email || age || !password)
            return res
                .status(401)
                .send({ status: "Error", error: "Incomplete values" });
        const user = new userModel({ first_name, last_name, email, age, password: createHash(password), });
        await user.save();
        req.session.name = user.first_name;
        req.session.email = user.email;
        req.session.admin = user.admin;
        console.log("Usuario registrado:", req.session);
        res.redirect("/products");
    } catch (err) {
        console.log("Error al registrar usuario: ", err);
        res.redirect("/");
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (isValidPassword(user, password)) {
            req.session.name = user.first_name;
            req.session.email = user.email;
            req.session.admin = user.admin;
            // res.redirect("/products");
            console.log("Usuario autenticado:", req.session);
            res.redirect("/products");
        } else {
            console.log("Usuario y/o contraseña incorrecta");
            res.redirect("/");
        }
    } catch (err) {
        console.log("Error al loggearse: ", err);
        res.redirect("/");
    }
};

export const logOut = async (req, res) => {
    try {
        // Verifica si el usuario está autenticado antes de cerrar la sesión
        console.log("Voy a cerrar la sesion: " + req.session.email)
        if (req.session.email) {
            delete req.session.email;
            // Opcionalmente, puedes destruir completamente la sesión
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error al cerrar la sesión", err);
                    res.status(500).send("Error al cerrar la sesión");
                } else {
                    console.log("Cerre la sesión: ")
                    res.redirect("/");
                }
            });
        } else {
            res.redirect("/");
        }
    } catch (err) {
        console.log("Error al cerrar la sesión: ", err);
        res.status(500).send("Error al cerrar la sesión");
    }
}