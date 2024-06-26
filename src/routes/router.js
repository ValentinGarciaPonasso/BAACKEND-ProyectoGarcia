import userController from "../controllers/user.controller.js";
import productController from "../controllers/product.controller.js";
import loginRouter from "../routes/login.js";
import productRouter from "../routes/product.router.js";
import cartController from "../controllers/cart.controller.js";
import emailRouter from "../controllers/email.controller.js";
import mockingProductsRouter from "../controllers/mockingProducts.controller.js";
import loggerTestController from "../controllers/loggerTest.controller.js";
import recoveryController from "../controllers/recovery.controller.js";
import usersListController from "../controllers/usersList.controller.js";
import configController from "../routes/config.controller.js";


const router = (app) => {
    ///USUARIOS
    app.use("/api/sessions",userController);
    app.use('/', loginRouter);
    app.use('/api/products', productController);
    app.use('/api/productos', productRouter);
    app.use('/api/cart', cartController);
    app.use('/api/email', emailRouter);
    app.use('/', mockingProductsRouter );
    app.use('/loggerTest', loggerTestController );
    app.use('/api/recoverPass', recoveryController);
    app.use('/api/users', usersListController);
    app.use('/config', configController);
};

export default router;