import * as userServices from "../services/user.service.js"
// import * as cartServices from "../services/carts.service.js"
import "dotenv/config.js";
import { passportCall, createHash, generateToken, isValidPassword } from "../utilitis.js";


const showProfile = (req, res) => {
    const { user } = req.session.user;
    res.render('profile', { user });
};

export { showProfile };

///////////////////////////////////////////////

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password)
            return res
                .status(400)
                .send({ status: "Error", Error: "Uno o varios datos incompletos" })

        let findUser = await userServices.getUser(email);
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
            let result = await userServices.addUser(newUser)
        }
        res.redirect("/api/sessions/current");
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
};

const loginUser = async (req, res) => {
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
            let user = await userServices.getUser(email)
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
}


export { registerUser, loginUser };