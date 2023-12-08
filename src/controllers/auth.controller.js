import userModel from "../dao/models/user.model.js";


export const registerUser= async (req, res) => {
    try{
        const{first_name, last_name, email,age, password,} = req.body;
        const user = new userModel({first_name, last_name, email,age, password,});
        await user.save();
        res.redirtect("/profile");
    } catch (err) { 
        console.log("Error al registrar usuario: ",err);
        res.redirtect("/");
    }
};

export const loginUser = async (req, res) => {
    try{
        const{name, email, password} = req.body;
        const user = await userModel.findOne({email, password});
        if (user) {
            require.session.user = user;
            res.redirtect("/profile");
        } else {
            console.log("Usuario y/o contraseña incorrecta");
            res.redirtect("/");
        }
    } catch (err) {
        console.log("Error al loggearse: ",err);
        res.redirtect("/");
    }
};

export const logOut = async (req, res) => {
    try{
        if(req.session.user) {
            delete req.session.user;

            req.session.destroy(error => {
                if(error) {
                    console.log("Error al cerrar sesion: ", error);
                    res.status(500).send("Error al cerrar la sesión");
                } else {
                    res.redirect("/");
                };
            })
        }
    } catch (err){
        console.log("Error al cerrar la sesión: ",err);
        res.status(500).send("Error al cerrar la sesión");
    }
}