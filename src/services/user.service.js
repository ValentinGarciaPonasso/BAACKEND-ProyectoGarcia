import UserDAO from "../dao/users.dao.js";

const Users = new UserDAO();

const getAll = () => {
    return Users.getAll();
};

const getOne = (username) => {
    return Users.getOne(username);
};

const deleteUser = (username) => {
    return Users.deleteOne(username);
};

const create = (newUser) => {
    return Users.create(newUser);
};

const modifyPass = (pass, userEmail) => {
    return Users.updatePass(pass, userEmail);
};

const modifyConection = (connectionTime, userEmail) => {
    return Users.updateConection (connectionTime, userEmail);
};

const modfyRole = (role, userEmail) => {
    return Users.updateRole(role, userEmail);
};

export { getAll, getOne, create, modifyPass, modfyRole, modifyConection, deleteUser }