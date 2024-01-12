import express from 'express';
import { productRouter, productRouterById, productRouterDb } from './routes/product.router.js';
import { cartRouter, cartRouterById, cartRouterDb} from './routes/cart.router.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import profileRouter from  './routes/profile.js';
import sessionRouter from './routes/session.js';
import _dirname from './utilitis.js';
import "dotenv/config.js";
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from "./persistence/ProductManager.js";
import ProductManagerMongo from "./persistence/ProductManagerMongo.js";
import CartManagerMongo from './persistence/CartManagerMongo.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import FileStore from 'session-file-store';
import { uploader } from './utilitis.js';
import { db } from "./config/databse.js";
import Handlebars from 'handlebars';
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const port = 8080;
const app = express();



const productManager = new ProductManager('./Productos.json');
const productManagerMongo = new ProductManagerMongo();
const cartManagerMongo = new CartManagerMongo();

//Estructura Handlebars
const hbs = handlebars.create({
    defaultLayout: 'main', // Reemplaza 'main' con tu diseño predeterminado
    extname: '.handlebars', // Reemplaza '.handlebars' con tu extensión de archivo
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});
app.engine('handlebars', hbs.engine);
// app.engine('handlebars', handlebars.engine());
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
        const productos = await productManagerMongo.getProduct();
        await io.emit("productoActualizado", productos);
    } catch (error) {
        console.error("Error al obtener producto:", error);
    }
    socket.on("nuevoProducto", async (newProduct) => {                                                      ///recibimos desde el servidor el mensaje y lo pusheamos a nuestro array
        console.log("Nuevo producto recibido:");
        console.log(newProduct);
        try {
            await productManagerMongo.addProduct(newProduct.title, newProduct.description, newProduct.code, newProduct.price, newProduct.status, newProduct.stock, newProduct.category, newProduct.thumbnail);
            const productos = await productManagerMongo.getProduct();
            await io.emit("productoActualizado", productos);
        } catch (e) {
            console.error("Error al agregar producto:", error);
        };
    });
    socket.on("eliminarProducto", async (deleteProduct) => {
        console.log("Nuevo producto a eliminar:");
        console.log(deleteProduct);
        const id = parseInt(deleteProduct, 10)
        try {
            await productManagerMongo.deleteProduct(id);
            const productos = await productManagerMongo.getProduct();
            io.emit("productoActualizado", productos);
        } catch (e) {
            console.error("Error al eliminar producto:", e);
        };
    });
    socket.on("cartUpdated", async (productAddedId) => {
        try {
            const product = await productManagerMongo.getProductById(productAddedId);
            console.log(`Buscamos producto con id ${productAddedId}: `, product);
            if (product) {
                //de momento hardcodeo el cartId
                let cartId = 1;
                await cartManagerMongo.addProductToCart(cartId, product);
                console.log("producto agregado")
            } else {
                console.log("No se encontró producto")
            }
        } catch (e) {
            console.error("Error al agregar producto:", e);
        };
    })
});


///Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//Productos
// app.get('/api/products', productRouter);
// app.get('/api/products/:productId', productRouterById);
// app.post('/api/products', productRouter);
// app.put('/api/products/:productId', productRouterById);
// app.delete('/api/products/:productId', productRouterById);
//MOSTRAMOS EL PRODUCTO EN EL HTML
// app.get('/', productRouter);
app.get('/realTimeProducts', productRouter);
app.get('/products', productRouter);
app.get('/products/:id', productRouter);
app.get('/carts/:cid', cartRouterDb);


//Carrito
// app.post('/api/carts', cartRouter);
// app.get('/api/carts/:cid', cartRouterById);
// app.post('/api/carts/:cid/product/:pid', cartRouterById);



////MONGO
app.use("/api/productos", productRouterDb);
app.use("/api/carrito", cartRouterDb);

///USUARIOS
app.use('/', loginRouter);
// app.use('/login', loginRouter);
// app.use('/register', registerRouter);
// app.use('/profile', profileRouter);
app.use('/api/sessions', sessionRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});





