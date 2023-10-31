import express from 'express';
import ProductManager from "../ProductManager.js";

const productRouter = express.Router();
const productRouterById = express.Router();

const productManager = new ProductManager('./Productos.json');


///PRODUCTO POR ID

//busca un producto por su id
productRouterById.get('/api/products/:productId', async (req, res) => {
    const id = parseInt(req.params.productId, 10);
    try {
        const product = await productManager.getProductById(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (e) {
        res.status(500).send('Error al leer archivo');
    }
});

//Modifica un producto el cual se indica en su id
productRouterById.put('/api/products/:productId', async (req, res) => {
    const id = parseInt(req.params.productId, 10);
    const field = req.body.field;
    const newValue = req.body.newValue;
    try {
        const updatedProduct = await productManager.updateProduct(id, field, newValue);
        res.status(200).json({
            data: updatedProduct,
            message: "Producto actualizado"
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al modificar producto');
    }
});

// Elimina un producto por su id

productRouterById.delete('/api/products/:productId', async (req, res) => {
    const id = parseInt(req.params.productId, 10);
    try {
        const product = await productManager.deleteProduct(id);
        res.status(200).json({
            massage: "Producto eliminado",
            data: product
        });

    } catch (error) {
        res.status(500).send('Error al eliminar producto');
    }
});


export { productRouterById };


///PRODUCTOS EN GENERAL

//Busca todos los productos
productRouter.get('/api/products', async (req, res) => {
    try {
        const product = await productManager.getProduct();
        const limitQuery = req.query.limit;
        if (limitQuery) {
            const productosLimitados = product.slice(0, limitQuery);
            res.status(200).json(productosLimitados);
        } else {
            res.status(200).json(product);
        }
    } catch (e) {
        res.status(500).send('Error al leer archivo');
    }
});

//Arega un producto según lo que se envíe en el body
productRouter.post('/api/products', async (req, res) => {
    try {
        const newProduct = await {
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: parseInt(req.body.price, 10),
            status: true,
            stock: parseInt(req.body.stock, 10),
            category: req.body.category,
            thumbnail: req.body.thumbnail
        }
        const newProducts = await productManager.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnail);
        res.status(200).json({
            massage: "Producto agregado",
            data: newProducts
        });
    } catch (error) {
        res.status(500).send('Error al agregar prodcuto');
    }
});

export { productRouter };
