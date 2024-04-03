import express from 'express';
import "dotenv/config.js";

const config = express.Router();

config.get('/', (req, res) => {
    console.log("hola desde config");
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    console.log("ruta: ", backendUrl);
    res.json({ backendUrl });
})

export default config;