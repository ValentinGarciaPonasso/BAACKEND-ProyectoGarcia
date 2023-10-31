import express from 'express';
import { productRouter, productRouterById } from './routes/product.router.js';
import { cartRouter, cartRouterById } from './routes/cart.router.js';

const port = 8080;
const app = express();

app.use(express.json())


//Productos
app.get('/api/products',productRouter);
app.get('/api/products/:productId',productRouterById);
app.post('/api/products',productRouter);
app.put('/api/products/:productId',productRouterById);
app.delete('/api/products/:productId',productRouterById);

//Carrito
app.post('/api/carts', cartRouter);
app.get('/api/carts/:cid', cartRouterById);
app.post('/api/carts/:cid/product/:pid', cartRouterById);

app.listen(port, () => {
    console.log(`El servidor esta escuchando por el puerto ${port}`);
});


