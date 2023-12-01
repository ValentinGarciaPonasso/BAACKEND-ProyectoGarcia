import express from 'express';
import { productRouter, productRouterById, productRouterDb } from './routes/product.router.js';
import { cartRouter, cartRouterById, cartRouterDb } from './routes/cart.router.js';
import _dirname from './utilitis.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import ProductManager from "./dao/ProductManager.js";
import ProductManagerMongo from "./dao/ProductManagerMongo.js";
import { uploader } from './utilitis.js';
import { db } from "./config/databse.js";
import Handlebars from 'handlebars';

const port = 8080;
const app = express();



const productManager = new ProductManager('./Productos.json');
const productManagerMongo = new ProductManagerMongo();

//Estructura Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${_dirname}/views`);
app.set('view engine', 'handlebars');
//Archivos Estaticos
app.use(express.static('src/public'));

Handlebars.registerHelper('lookup', function(obj, field) {
    return obj[field];
  });

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

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
            console.error("Error al eliminar producto:", error);
        };
    });
});



//Productos
app.get('/api/products', productRouter);
app.get('/api/products/:productId', productRouterById);
app.post('/api/products', productRouter);
app.put('/api/products/:productId', productRouterById);
app.delete('/api/products/:productId', productRouterById);
//MOSTRAMOS EL PRODUCTO EN EL HTML
app.get('/', productRouter);
app.get('/realTimeProducts', productRouter);
app.get('/products', productRouter);
app.get('/products/:id', productRouter);


//Carrito
app.post('/api/carts', cartRouter);
app.get('/api/carts/:cid', cartRouterById);
app.post('/api/carts/:cid/product/:pid', cartRouterById);



////MONGO
app.use("/api/productos", productRouterDb);
app.use("/api/carrito", cartRouterDb);





