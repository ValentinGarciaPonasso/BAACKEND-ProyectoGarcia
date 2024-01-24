
import {Router} from "express";
import * as productService from "../services/product.service.js";
import "dotenv/config.js";

import { passportCall, createHash, generateToken, isValidPassword } from '../utilitis.js';




////////////////////

const router = new Router();

router.get('/realTimeProducts', passportCall ('jwt'), async (req, res) => {
    try {
        const product = await productService.getAll();
        console.log ("Productos dedsde router: " + product)
        res.render('index', {
            product: product,
            title: "Productos en tiempo Real"
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al obtener productos');
    }
});

export default router