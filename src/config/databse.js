import mongoose from "mongoose";


const URL = "mongodb+srv://vgarciaponasso:Va.le4495@ecommerce.stekczn.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URL, {})

const db = mongoose.connection;

db.on("error", console.error.bind(console, 'Error de conexiona  la base de datos'));
db.once('open', () => {
    console.log('Conectado a la base de datos');
});

export {mongoose, db};