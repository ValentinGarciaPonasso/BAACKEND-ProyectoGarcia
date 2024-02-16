import express from 'express';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import profileRouter from  './routes/profile.js';
import _dirname from './utilitis.js';
import "dotenv/config.js";
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from "./dao/ProductManager.js";
import ProductManagerMongo from "./dao/ProductManagerMongo.js";
import CartManagerMongo from './dao/CartManagerMongo.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import FileStore from 'session-file-store';
import { uploader } from './utilitis.js';
import { db } from "./config/databse.js";
import Handlebars from 'handlebars';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import router from './routes/router.js';
import * as productService from "./services/product.service.js";
import * as cartService from "./services/cart.service.js";
import errorHandler from "./middlewares/error/handle.error.js";
import { addLogger } from './middlewares/logger.middleware.js';
import { passportCall} from "./utilitis.js";

const port = 8080;
const app = express();



const productManager = new ProductManager('./Productos.json');
const productManagerMongo = new ProductManagerMongo();
const cartManagerMongo = new CartManagerMongo();

//Estructura Handlebars
const hbs = handlebars.create({
    defaultLayout: 'main', 
    extname: '.handlebars', 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});
app.engine('handlebars', hbs.engine);
app.set('views', `${_dirname}/views`);
app.set('view engine', 'handlebars');

//Archivos Estaticos
app.use(express.static('src/public'));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: process.env.hash,
    resave: false, 
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: process.env.mongo,

        ttl: 2 * 60, 
    }),
}));

//SERVER PARA WEBSOCKET
const server = app.listen(port, () => {
    console.log(`El servidor esta escuchando por el puerto ${port}`)
})
const io = new Server(server);



io.on('connection', async (socket) => {
    console.log("Un cliente se ha conectado");
    try {
        const productos = await productService.getAll();
        
        await io.emit("productoActualizado", productos);
    } catch (error) {
        console.error("Error al obtener producto:", error);
    }
    socket.on("nuevoProducto", async (newProduct) => {               ///recibimos desde el servidor el mensaje y lo pusheamos a nuestro array
        console.log("Nuevo producto recibido:");
        console.log(newProduct);
        try {
            await productService.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnail, newProduct.owner);
            const productos = await productService.getAll();
            await io.emit("productoActualizado", productos);
        } catch (e) {
            console.error("Error al agregar producto:", error);
        };
    });
    socket.on("eliminarProducto", async (data) => {
        const id = parseInt(data.deleteProductId, 10)
        try {
            let prductToRemove = await productService.getByID(id);
            console.log(prductToRemove);
            console.log("Owner producto a eliminar: " + prductToRemove[0].owner);
            console.log("usuario logeado:" + data.email);
            console.log("role de usuario: " + data.role);
            if (prductToRemove[0].owner === data.email || data.role === "admin") {
                await productService.removeProduct(id);
                const productos = await productService.getAll();
                io.emit("productoActualizado", productos);
                let eliminado = true;
                io.emit("productoEliminado", eliminado);
            } else {
                console.log("El usuario no cuenta con permisos para eliminar el producto");
                let eliminado = false
                io.emit("productoNoEliminado", eliminado);
            }
        } catch (e) {
            console.error("Error al eliminar producto:", e);
        };
    });
    socket.on("cartUpdated", async (data) => {
        try {
            const productAddedId = data.variable1;
            const cartId = data.variable2;
            const product = await productService.getByID(productAddedId);
            console.log(`Buscamos producto con id ${productAddedId}: `, product);
            if (product) {
                const newCarrito = await cartService.addProductToCart(cartId, product);
                console.log(`Nuevo carrito: ` ,newCarrito);
            } else {
                console.log("No se encontró producto")
            }
        } catch (e) {
            console.error("Error al agregar producto:", e);
        };
    });
    socket.on("deleteFromCart", async (data) => {
        try {
            const productAddedId = data.variable1;
            const productId = parseInt(productAddedId, 10);
            const cartId = data.variable2;
            console.log(`Id producto a eliminar:  ${productId} `);
            console.log(`Id carrito a modificar:  ${cartId} `);
            const newCarrito = await cartService.deleteProduct(cartId, productId);
            console.log(`Nuevo carrito: ` ,newCarrito);
            io.emit("carritoActualizado", newCarrito);

        } catch (e) {
            console.error("Error al agregar producto:", e);
        };
    });
});

///Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//MIDLEWARE PARA MANEJO DE LOGGER
app.use (addLogger);

//ROUTER
router(app);

//MIDDLEWARE ERROR HANDLER
app.use(errorHandler);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});