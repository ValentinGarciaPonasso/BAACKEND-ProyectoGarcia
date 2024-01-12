import userModel from "./models/user.model.js";
import { isValidPassword } from "../utilitis.js";

const getUser= async(username)=>{
    const user = await userModel.findOne(
        {email: username}, 
        {email:1, first_name:1,last_name: 1, age:1, password:1, role:1}
    );
    return  user;
}

const addUser = async(newUser) =>{

    return await userModel.create(newUser);
}


export{getUser,addUser}