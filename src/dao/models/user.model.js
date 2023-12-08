import mongoose from 'mongoose';

const userCollection = 'userlogin';
const {Schema, model} = mongoose;

const userSchema = new Schema ({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,   ////scha 512 o scha 256
});

const userModel = model(userCollection, userSchema);

export default userModel;

