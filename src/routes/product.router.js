import express from 'express';
import ProductManager from "../persistence/ProductManager.js";
import ProductManagerMongo from "../persistence/ProductManagerMongo.js";
import { passportCall, createHash, generateToken, isValidPassword } from '../utilitis.js';
import { uploader } from '../utilitis.js';
import Products from '../persistence/models/product.models.js';


const productRouter = express.Router();
const productRouterById = express.Router();

const productRouterDb = express.Router();

const productManager = new ProductManager('./Productos.json');
const productManagerMongo = new ProductManagerMongo();


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

//MOSTRAMOS PRODUCTOS EN PANTALLA
productRouter.get('/', async (req, res) => {
    try {
        const product = await productManager.getProduct();
        console.log("hola");
        res.render('home', {
            product: product,
            title: "Listado de Productos"
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al leer archivo');
    }
});

productRouter.get('/realTimeProducts', async (req, res) => {
    try {
        const product = await productManager.getProduct();
        res.render('index', {
            // layout: 'realTimeProducts',
            product: product,
            title: "Productos en tiempo Real"
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al leer archivo');
    }
});

productRouter.get('/products',passportCall ('jwt'), async (req, res) => {
    let userData = req.user.user;
    try {
        const { limit = 10, page = 1, sort, category, available} = req.query;
        const product = await productManagerMongo.getProductPaginate(page, limit, sort,category, available);
        product.prevLink = product.hasPrevPage?`http://localhost:8080/products/?page=${product.prevPage}`:'';
        product.nextLink = product.hasNextPage?`http://localhost:8080/products/?page=${product.nextPage}`:'';
        console.log("Producto desde router: ",product);
        console.log("Usuario autenticado  en products:", userData);
        let admin = false;
        if (userData.role === 'admin') {
            admin = true;
        }
        console.log("admin: ", admin);
        res.render('products', {
            user: userData,
            admin: admin,
            title: "Listado de Productos",
            product
        })
    } catch (e) {
        console.log(e);
        res.status(500).send('Error al leer archivo');
    }
});

productRouter.get('/products/:id', async (req, res) => {
    try {
        const product = await productManagerMongo.getProductById(req.params.id);
        res.render('productDetail', {
            titulo: product[0].title,
            product
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export { productRouter };

///DB CON MONGO

productRouterDb.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, category, available} = req.query;
        const products = await productManagerMongo.getProductPaginate(page, limit, sort,category, available);
        res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/productos?page=${products.prevPage}`+(limit ? `&limit=${products.limit}` : '')+(sort ? `&sort=${sort}` : '')+(category ? `&category=${category}` : '')+(available ? `&available=${available}` : '') : null,
            nextLink: products.hasNextPage ? `/api/productos?page=${products.nextPage}`+(limit ? `&limit=${products.limit}` : '')+(sort ? `&sort=${sort}` : '')+(category ? `&category=${category}` : '')+(available ? `&available=${available}` : '') : null 
        });
        // // res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



productRouterDb.get("/:id", async (req, res) => {
    try {
        const products = await productManagerMongo.getProductById(req.params.id);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


productRouterDb.post('/', async (req, res) => {
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
        const newProducts = await productManagerMongo.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnail);
        res.status(201).json({
            massage: "Producto agregado",
            data: newProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productRouterDb.put("/:id", async (req, res) => {
    const id = req.params.id;
    const productUpdate = req.body
    console.log("id es: ", id);
    console.log("Datos a actualizar: ", productUpdate)
    try {
        const product = await productManagerMongo.updateProduct(id, productUpdate);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        };
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

productRouterDb.delete("/:id", async (req, res) => {
    try {
        const products = await productManagerMongo.deleteProduct(req.params.id)
        res.status(201).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export { productRouterDb };