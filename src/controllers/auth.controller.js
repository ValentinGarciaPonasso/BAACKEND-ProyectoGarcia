import userModel from "../dao/models/user.model.js";


export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const user = new userModel({ first_name, last_name, email, age, password, });
        await user.save();
        res.redirect("/products");
    } catch (err) {
        console.log("Error al registrar usuario: ", err);
        res.redirect("/");
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email, password });
        if (user) {
            req.session.name = user.first_name;
            req.session.email = user.email;
            req.session.admin = user.admin;
            // res.redirect("/products");
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
        if (req.session.user) {
            delete req.session.user;
            // Opcionalmente, puedes destruir completamente la sesión
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error al cerrar la sesión", err);
                    res.status(500).send("Error al cerrar la sesión");
                } else {
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