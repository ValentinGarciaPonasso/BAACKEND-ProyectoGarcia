import {Router} from "express";
import express from 'express';
import * as cartService from "../services/cart.service.js";
import * as productService from "../services/product.service.js";
import * as userService from "../services/user.service.js";
import { passportCall} from "../utilitis.js";
import "dotenv/config.js";

const router = new Router();

router.get('/createCart', passportCall ('jwt'), async(req, res) => {
    let userData = req.user.user;
    // let userData = {first_name:"admin", last_name:"admin", email:"admin", password:"prueba", age: 99, role: "user"}
    try {
        console.log("user desde controller: " + userData)
        const newCart = await cartService.createCart(userData);
        res.status(200).redirect("/api/sessions/current");
    } catch (e) {
        console.log(e);
        res.redirect("/");
    }
});

router.get('/:cid',passportCall ('jwt'), async (req, res) => {
    const id = parseInt(req.params.cid, 10);
    try {
        let userData = req.user.user;
        const cart = await cartService.getCartById(id);
        let products = cart[0].products;
        if (cart) {
            res.status(200).render('cartDetail', {
                user: userData,
                products,
                cart: cart
            });
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (e) {
        res.status(500).send('Error al buscar carrito');
    }
});

router.post('/:cid/productos/:pid', async(req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try{
        const product = await productService.getByID(productId);
        console.log(`Buscamos producto con id ${productId}: ` ,product);
        if(product) {
            const newCarrito = await cartService.addProductToCart(cartId, product);
            console.log(`Nuevo carrito: ` ,newCarrito);
            res.status(200).json({
                massage: "Producto agregado al carrito",
                data: newCarrito
            });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (e) {
        res.status(500).send('Error al agregar producto al carrito');
    }
});

router.delete("/:cid/producto/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try {
        const cart = await cartService.deleteProduct(cartId,productId)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
        const cart = await cartService.vaciarCarrito(cartId,)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productUpdate = req.body
    try {
        const cart = await cartService.updateProducts(cartId,productUpdate)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:cid/productos/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const productUpdateQuantity = req.body.quantity
    console.log(productUpdateQuantity)
    try {
        const cart = await cartService.updateProductsQuantity(cartId,productId,productUpdateQuantity)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//MOSTRAMOS PRODUCTOS EN PANTALLA
router.get('/carts/:cid', async (req, res) => {
    const id = parseInt(req.params.cid, 10);
    try {
        const cart = await cartService.getCartById(id);
        if (cart) {
            let products = cart.products;
            res.render('cartDetail', {
                id: cart.id,
                products: products
            })
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (e) {
        res.status(500).send('Error al buscar carrito');
    }
});

export default router