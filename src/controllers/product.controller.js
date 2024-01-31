import {Router} from "express";
import * as productService from "../services/product.service.js";
import * as cartService from "../services/cart.service.js";
import { passportCall} from "../utilitis.js";
import "dotenv/config.js";

const router = new Router();

router.get('/all', async (req, res) => {
    try {
        const product = await productService.getAll();
        res.render('home', {
            product: product,
            title: "Listado de Productos"
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al leer archivo');
    }
});

router.get('/:id',passportCall ('jwt'), async (req, res) => {
    try {
        let userData = req.user.user;
        const cart = await cartService.getCartByUser(userData._id);
        const product = await productService.getByID (req.params.id);
        let admin = false;
        if (userData.role === 'admin') {
            admin = true;
        }
        console.log("admin: ", admin);
        console.log(req.params.id)
        res.render('productDetail', {
            user: userData,
            admin: admin,
            titulo: product[0].title,
            product,
            cart: cart
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await {
            title: req.body.title,
            description: req.body.description,
            code: req.body.code,
            price: parseInt(req.body.price, 10),
            available: true,
            stock: parseInt(req.body.stock, 10),
            category: req.body.category,
            thumbnail: req.body.thumbnail
        }

        const newProducts = await productService.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.available, newProduct.stock, newProduct.category, newProduct.thumbnail);
        res.status(200).json({
            massage: "Producto agregado",
            data: newProducts
        });
    } catch (error) {
        res.status(500).send('Error al agregar prodcuto');
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const productUpdate = req.body
    console.log("id es: ", id);
    console.log("Datos a actualizar: ", productUpdate)
    try {
        const product = await productService.updateProduct(id, productUpdate);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        };
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const products = await productService.removeProduct(req.params.id)
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/',passportCall ('jwt'), async (req, res) => {
    let userData = req.user.user;
    try {
        console.log("user desde controller product: " + userData);
        const cart = await cartService.getCartByUser(userData._id);
        const { limit = 10, page = 1, sort, category, available} = req.query;
        const product = await productService.paginate(page, limit, sort,category, available);
        product.prevLink = product.hasPrevPage?`http://localhost:8080/api/products/?page=${product.prevPage}`:'';
        product.nextLink = product.hasNextPage?`http://localhost:8080/api/products/?page=${product.nextPage}`:'';
        console.log("Producto desde router: ",product);
        console.log("Usuario autenticado  en products:", userData);
        console.log("carrito desde product controller: " + cart)
        let admin = false;
        if (userData.role === 'admin') {
            admin = true;
        }
        console.log("admin: ", admin);
        res.render('products', {
            user: userData,
            admin: admin,
            title: "Listado de Productos",
            product, 
            cart: cart,
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al leer archivo');
    }
});



export default router;