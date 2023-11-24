import fs from 'fs';
import Cart from './models/cart.models.js';

export default class CartManagerMongo {
    constructor() {
        this.carts = [];
    };


    async createCart (){
        try {
            //generamos un id único
            const cartId = this.carts.length + 1;
            const cartProducts = [];
            const cart = new Cart({
                cartId,
                cartProducts,
            });
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
            console.log(`Buscamos carrito con id ${cartId}: ` ,cart);
            if(cart) {
                console.log("cart.Products: ", cart.products);
                const isProduct = cart.products.find(isProduct => isProduct.id === product.id);
                console.log("isProduct: ", isProduct);
                if (isProduct) {
                    //hacer un update
                    isProduct.quantity = isProduct.quantity + 1;
                    console.log("Producto sumado con éxito, nuevo isProduct: ", isProduct);
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await cart.findByIdAndUpdate (idUpdate,isProduct, {new:true}  );
                    console.log("cart: ", carts);
                    return carts;
                } else {
                    //hacer un update
                    const newproduct = {
                        id: product.id,
                        quantity: 1
                    }
                    cart.products.push(newproduct);
                    console.log("cart.Products despues de agregado: ", cart.products);
                    console.log("Carrito con el producto agregado: ", cart);
                    console.log("Todos los carritos: ", carts);
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await cart.findByIdAndUpdate (idUpdate,newproduct, {new:true}  );
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