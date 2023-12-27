import mongoose from 'mongoose';

const userCollection = 'userlogin';
const {Schema, model} = mongoose;

const userSchema = new Schema ({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,   ////scha 512 o scha 256
    role: {
        type: String,
        default: "user",
    },
    cart: Number,
});

const userModel = model(userCollection, userSchema);

export default userModel;

