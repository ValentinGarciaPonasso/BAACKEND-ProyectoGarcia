import express from 'express';
import { productRouter, productRouterById } from './routes/product.router.js';
import { cartRouter, cartRouterById } from './routes/cart.router.js';
import _dirname from './utilitis.js'; 
import handlebars from 'express-handlebars';
import http from 'http';
import { Server} from 'socket.io';
import ProductManager from "./ProductManager.js";
import { uploader } from './utilitis.js';

const port = 8080;
const app = express();

const productManager = new ProductManager('./Productos.json');

//Estructura Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${_dirname}/views`);
app.set('view engine', 'handlebars');
//Archivos Estaticos
app.use(express.static('src/public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//SERVER PARA WEBSOCKET
const server = app.listen(port,()=>{
    console.log(`El servidor esta escuchando por el puerto ${port}`)
})
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("Un cliente se ha conectado");
    socket.on("nuevoProducto", (newProduct)=> {                                                      ///recibimos desde el servidor el mensaje y lo pusheamos a nuestro array
        console.log("Nuevo producto recibido:");
        console.log(newProduct);
    })
});



//Productos
app.get('/api/products',productRouter);
app.get('/api/products/:productId',productRouterById);
app.post('/api/products',productRouter);
app.put('/api/products/:productId',productRouterById);
app.delete('/api/products/:productId',productRouterById);
//MOSTRAMOS EL PRODUCTO EN EL HTML
app.get('/',productRouter);
// app.get('/realTimeProducts',productRouter);


//Carrito
app.post('/api/carts', cartRouter);
app.get('/api/carts/:cid', cartRouterById);
app.post('/api/carts/:cid/product/:pid', cartRouterById);



// app.listen(port, () => {
//     console.log(`El servidor esta escuchando por el puerto ${port}`);
// });


