import mongoose from "mongoose";
import "dotenv/config.js";



const URL = process.env.mongo;

mongoose.connect(URL, {})

const db = mongoose.connection;

db.on("error", console.error.bind(console, 'Error de conexion a  la base de datos'));
db.once('open', () => {
    console.log('Conectado a la base de datos');
});

export {mongoose, db};