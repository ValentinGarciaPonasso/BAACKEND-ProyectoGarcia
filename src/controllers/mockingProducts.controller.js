import {Router} from "express";
import productList from "../mock.utils.js";

const router = Router();

router.get('/mockingproducts', (req,res) => {
    const {numOfProducts = 100} = req.query;
    const products = productList(numOfProducts);
    res.json({message: products});
});

export default router;