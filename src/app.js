import express from 'express';
import fs from 'fs';
import ProductManager from "./ProductManager.js";

const port = 8080;
const app = express();
const productManager = new ProductManager('./Productos.json');

app.use(express.urlencoded({ extended: true }));

app.get('/products/:productId', async (req, res) => {
    const id = parseInt(req.params.productId, 10);
    try {
        const product = await productManager.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al leer archivo');
    }
});

app.get('/products', async (req, res) => {
    try {
        const product = await productManager.getProduct();
        const limitQuery = req.query.limit;
        if (limitQuery) {
            const productosLimitados = product.slice (0,limitQuery);
            res.json(productosLimitados);
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send('Error al leer archivo');
    }
});


app.listen(port, () => {
    console.log(`El servidor esta escuchando por el puerto ${port}`);
});


