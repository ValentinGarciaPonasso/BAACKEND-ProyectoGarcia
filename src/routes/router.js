import userController from "../controllers/user.controller.js";
import productController from "../controllers/product.controller.js";
import loginRouter from "../routes/login.js";
import productRouter from "../routes/product.router.js";
import cartController from "../controllers/cart.controller.js";
import emailRouter from "../controllers/email.controller.js";


const router = (app) => {
    ///USUARIOS
    app.use("/api/sessions",userController);
    app.use('/', loginRouter);
    app.use('/api/products', productController);
    app.use('/api/productos', productRouter);
    app.use('/api/cart', cartController);
    app.use('/api/email', emailRouter);

};

export default router;