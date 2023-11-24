import fs from 'fs';
import Cart from './models/cart.models.js';

export default class CartManagerMongo {
    constructor() {
        this.carts = [];
    };


    async createCart (){
        try {
            this.carts = await Cart.find ();
            console.log('carritos: ', this.carts);
            //generamos un id único
            const cartId = this.carts.length + 1;
            const cartProducts = [];
            const cart = new Cart({
                id: cartId,
                products: cartProducts,
            });
            console.log('carrito: ', cart)
            /// Agregamos el carrito al archivo
            const newCart = await cart.save();
            console.log("Carrito creado con éxito");
            return newCart
        } catch (e) {
            console.error("Ocurrió un error al crear el carrito", e);
            throw e;
        };
    };

    async getCartById(id) {
        try {
            const carts = await Cart.find ();
            const cartId = carts.find(cart => cart.id === id);
            if (cartId) {
                console.log(`Carrito con id = ${id}:`, cartId);
                return cartId;
            } else {
                console.log(`Carrito con id ${id} no encontrado`);
                return null;
            }
        } catch (error) {
            console.error('Error al consultar carrito por ID', error);
            throw error;
        }
    };

    async addProductToCart (cartId, product) {
        try {
            // const carts = await Cart.find ();
            // const cart = carts.find(cart => cart.id === cartId);
            const cart = await Cart.findOne ({id: cartId})
            const idUpdate =  cart._id.toString()
            console.log("idUpdate en manager: ", idUpdate);
            console.log(`Buscamos carrito con id ${cartId}: ` ,cart);
            if(cart) {
                console.log("cart.Products: ", cart.products);
                console.log("Product en manager ", product);
                const idProducto = product[0].id;
                console.log("Product ID en manager ", idProducto);
                const isProduct = cart.products.find(isProduct => isProduct.id === idProducto);
                console.log("isProduct: ", isProduct, " / id del producto que mandamos por params: ",idProducto);
                if (isProduct) {
                    //hacer un update
                    isProduct.quantity = isProduct.quantity + 1;
                    console.log("Producto sumado con éxito, nuevo isProduct: ", isProduct);
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await Cart.findByIdAndUpdate (idUpdate,cart, {new:true}  );
                    console.log("cart: ", carts);
                    return carts;
                } else {
                    console.log("Hola en el else")
                    //hacer un update
                    const newproduct = {
                        id: idProducto,
                        quantity: 1
                    }
                    cart.products.push(newproduct);
                    console.log("cart.Products despues de agregado: ", cart.products);
                    console.log("Carrito con el producto agregado: ", cart);
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await Cart.findByIdAndUpdate (idUpdate,cart, {new:true}  );
                    console.log("cart: ", carts);
                    console.log("Producto agregado con éxito");
                    return carts;
                }                
            } else {
                throw new Error (`Carrito con id ${cartId} no encontrado`);
            }

        } catch (e) {
            console.error("Ocurrió un error al agregar el producto al carrito", e);
            throw e;
        };
    }

}