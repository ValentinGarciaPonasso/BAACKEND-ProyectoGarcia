import UserDAO from "../dao/users.dao.js";

const Users = new UserDAO();

const getAll = (username) => {
    return Users.getAll(username);
};

const getOne = (username) => {
    return Users.getOne(username);
};

const create = (newUser) => {
    return Users.create(newUser);
};

export { getAll, getOne, create }