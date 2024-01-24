// import userModel from "./models/user.model.js";
// import { isValidPassword } from "../utilitis.js";

// const getUser= async(username)=>{
//     const user = await userModel.findOne(
//         {email: username}, 
//         {email:1, first_name:1,last_name: 1, age:1, password:1, role:1}
//     );
//     return  user;
// }

// const addUser = async(newUser) =>{

//     return await userModel.create(newUser);
// }


// export{getUser,addUser}

///////////////////////////////////////////////

import userModel from "./models/user.model.js";
import UserDTO from "../DTOs/user.dto.js";

class UserDao {
    constructor() {}

    async getAll() { 
        try {
            return await userModel.find();
        } catch (e) {
            throw e;
        }
    };

    async getOne (username) {
        try {
            return await userModel.findOne(
                {email: username}, 
                {email:1, first_name:1,last_name: 1, age:1, password:1, role:1}
            );
        } catch (e) {
            throw e;
        }
    };

    async create(userInfo) {
        try {
            const newUserInfo = new UserDTO(userInfo);
            return await userModel.create(newUserInfo);
        } catch (e) {
            throw e;
        }
    };
}

export default UserDao;