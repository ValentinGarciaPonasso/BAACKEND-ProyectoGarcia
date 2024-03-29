import express from 'express';
import CartManager from "../dao/CartManager.js";
import ProductManager from '../dao/ProductManager.js';
import ProductManagerMongo from "../dao/ProductManagerMongo.js";
import CartManagerMongo from '../dao/CartManagerMongo.js';
import { passportCall} from "../utilitis.js";

const cartRouter = express.Router();
const cartRouterById = express.Router();
const cartRouterDb = express.Router();

const cartManager = new CartManager('./Cart.json');
const cartManagerMongo = new CartManagerMongo();
const productManager = new ProductManager('./Productos.json');
const productManagerMongo = new ProductManagerMongo();


///CARRITOS GENERICOS

///Crear Carrito
cartRouter.post('/api/carts', async(req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(200).json({
            massage: "Carrito creado",
            data: newCart
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al crear el carrito');
    }
})

export {cartRouter};

///CARRITOS POR ID

///BUSCAR CARRITO POR ID
cartRouterById.get('/api/carts/:cid', async (req, res) => {
    const id = parseInt(req.params.cid, 10);
    try {
        const cart = await cartManager.getCartById(id);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (e) {
        res.status(500).send('Error al leer archivo');
    }
});


///AGREGAR PRODUCTO A CARRITO
cartRouterById.post('/api/carts/:cid/product/:pid', async(req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try{
        const product = await productManager.getProductById(productId);
        console.log(`Buscamos producto con id ${productId}: ` ,product);
        if(product) {
            const newCarrito = await cartManager.addProductToCart(cartId, product);
            console.log(`Nuevo carrito: ` ,newCarrito);
            res.status(200).json({
                massage: "Producto agregado al carrito",
                data: newCarrito
            });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (e) {
        res.status(500).send('Error al agregar producto al carrito');
    }
})

export {cartRouterById};
















///MONGO

cartRouterDb.post('/', async(req, res) => {
    try {
        const newCart = await cartManagerMongo.createCart();
        res.status(200).json({
            massage: "Carrito creado",
            data: newCart
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al crear el carrito');
    }
})


cartRouterDb.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid, 10);
    try {
        const cart = await cartManagerMongo.getCartById(id);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (e) {
        res.status(500).send('Error al buscar carrito');
    }
});

cartRouterDb.post('/:cid/productos/:pid', async(req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try{
        const product = await productManagerMongo.getProductById(productId);
        console.log(`Buscamos producto con id ${productId}: ` ,product);
        if(product) {
            const newCarrito = await cartManagerMongo.addProductToCart(cartId, product);
            console.log(`Nuevo carrito: ` ,newCarrito);
            res.status(200).json({
                massage: "Producto agregado al carrito",
                data: newCarrito
            });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (e) {
        res.status(500).send('Error al agregar producto al carrito');
    }
})

cartRouterDb.delete("/:cid/producto/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try {
        const cart = await cartManagerMongo.deleteProduct(cartId,productId)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouterDb.delete("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
        const cart = await cartManagerMongo.deleteProducts(cartId,)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouterDb.put("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productUpdate = req.body
    try {
        const cart = await cartManagerMongo.updateProducts(cartId,productUpdate)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouterDb.put("/:cid/productos/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const productUpdateQuantity = req.body.quantity
    console.log(productUpdateQuantity)
    try {
        const cart = await cartManagerMongo.updateProductsQuantity(cartId,productId,productUpdateQuantity)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//MOSTRAMOS PRODUCTOS EN PANTALLA
cartRouterDb.get('/carts/:cid', async (req, res) => {
    const id = parseInt(req.params.cid, 10);
    try {
        const cart = await cartManagerMongo.getCartById(id);
        if (cart) {
            let products = cart.products;
            res.render('cartDetail', {
                id: cart.id,
                products: products
            })
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (e) {
        res.status(500).send('Error al buscar carrito');
    }
});

export {cartRouterDb};







