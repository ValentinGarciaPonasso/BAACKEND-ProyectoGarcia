import { Router } from "express";
import express from 'express';
import * as cartService from "../services/cart.service.js";
import * as productService from "../services/product.service.js";
import * as ticketService from "../services/ticket.service.js";
import * as userService from "../services/user.service.js";
import { passportCall } from "../utilitis.js";
import "dotenv/config.js";

const router = new Router();

router.get('/createCart', passportCall('jwt'), async (req, res) => {
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

router.get('/:cid', passportCall('jwt'), async (req, res) => {
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

router.post('/:cid/productos/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    try {
        const product = await productService.getByID(productId);
        console.log(`Buscamos producto con id ${productId}: `, product);
        if (product) {
            const newCarrito = await cartService.addProductToCart(cartId, product);
            console.log(`Nuevo carrito: `, newCarrito);
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
        const cart = await cartService.deleteProduct(cartId, productId)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    try {
        const cart = await cartService.vaciarCarrito(cartId)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid, 10);
    const productUpdate = req.body
    try {
        const cart = await cartService.updateProducts(cartId, productUpdate)
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
        const cart = await cartService.updateProductsQuantity(cartId, productId, productUpdateQuantity)
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


///PURCHASER

router.get('/:cid/purchase', passportCall('jwt'), async (req, res) => {
    try {
        let amount = 0;
        let productsInTicket = [];
        let products = [];
        let userData = req.user.user;
        const cartId = parseInt(req.params.cid, 10);
        let cart = await cartService.getCartById(cartId);
        const productsInCart = cart[0].products;
        console.log("Products in Cart: " + productsInCart)

        //Vaciamos el carrito
        await cartService.vaciarCarrito(cartId)
        //Recorremos todos los productos del carrito
        // productsInCart.forEach(async product => {
            for (const product of productsInCart){
            //Buscamos el producto en la BD
            let productInStock = await productService.getByID(product.id);
            let stockProducto = productInStock[0].stock; 
            console.log("Stock de producto: " + stockProducto);
            console.log("producto: " + product);
            console.log("Cantidad en carrito: " + product.quantity);
            //Evaluamos si queda stock
            if (stockProducto - product.quantity >= 0) {
                productInStock[0].stock = stockProducto - product.quantity;
                console.log("Product in Stock actualizado: " + productInStock);
                await productService.updateProduct(productInStock[0].id, productInStock[0])
                console.log("precio: " + product._id.price); 
                amount = amount + product._id.price * product.quantity;
                let productInTicket = {
                    title: product._id.title,
                    price: product._id.price,
                    quantity:product.quantity,
                    inStok: true
                }
                productsInTicket.push(productInTicket);
                console.log("Productc in stock: " + productsInTicket);
            } else {
                //agregamos el producto nuevamente al carrito
                console.log("Producto sin stock: " + product);
                products.push(product);
                console.log("Productos: " + JSON.stringify(products));
                await cartService.addProductToCart(cartId, products)
                let productInTicket = {
                    title: product._id.title,
                    price: product._id.price,
                    inStok: false
                };
                productsInTicket.push(productInTicket);
                console.log("Productc in stock: " + JSON.stringify(productsInTicket));
            }
        }
        //);
        console.log("Total de la compra: " + amount)
        const ticket = await ticketService.createTicket(amount, userData.email,productsInTicket)         
        console.log("ticket: " + ticket.products);
        res.status(200).render('purchase', {
            user: userData,
            ticket: ticket,
            products: ticket.products,
        });
    } catch (e) {
        res.status(500).send('Error al procesar la compra');
    }
})

export default router