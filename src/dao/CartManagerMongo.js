import fs from 'fs';
import Cart from './models/cart.models.js';
import Products from './models/product.models.js';

export default class CartManagerMongo {
    constructor() {
        this.carts = [];
    };


    async createCart() {
        try {
            this.carts = await Cart.find();
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
            console.log('id aca', id)
            const carts = await Cart.findOne({id: id}).populate("products._id");
            console.log("Carrito con el populate: ",carts)
            if(carts) {
                console.log(`Carrito con id = ${id}:`, carts);
                return carts;
            } else {
                console.log(`Carrito con id ${id} no encontrado`);
                return null;
            }
            // const cartId = carts.find(cart => cart.id === id);
            // if (cartId) {
            //     console.log(`Carrito con id = ${id}:`, cartId);
            //     return cartId;
            // } else {
            //     console.log(`Carrito con id ${id} no encontrado`);
            //     return null;
            // }
        } catch (error) {
            console.error('Error al consultar carrito por ID', error);
            throw error;
        }
    };

    async addProductToCart(cartId, product) {
        try {
            const cart = await Cart.findOne({ id: cartId })
            const idUpdate = cart._id.toString()
            if (cart) {
                const idProducto = product[0].id;
                const isProduct = cart.products.find(isProduct => isProduct.id === idProducto); 
                if (isProduct) {
                    //hacer un update
                    isProduct.quantity = isProduct.quantity + 1;
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await Cart.findByIdAndUpdate(idUpdate, cart, { new: true });
                    return carts;
                } else {
                    //hacer un update
                    const newproduct = {
                        id: idProducto,
                        quantity: 1,
                        _id: product[0]._id.toString(),
                    }
                    cart.products.push(newproduct);
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await Cart.findByIdAndUpdate(idUpdate, cart, { new: true });
                    return carts;
                }
            } else {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }
        } catch (e) {
            console.error("Ocurrió un error al agregar el producto al carrito", e);
            throw e;
        };
    }

    //Metodo para eliminar un producto del carrito
    async deleteProduct(cartId, productId) {
        try {
            const cartFind = await Cart.findOne({ id: cartId })
            const idUpdate = cartFind._id.toString()
            const indiceProduct = cartFind.products.findIndex(product => product.id === productId);
            if (indiceProduct !== -1) {
                cartFind.products.splice(indiceProduct, 1);
                const carts = await Cart.findByIdAndUpdate(idUpdate, cartFind, { new: true });
                return carts;
            } else {
                console.log('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    };

    //Metodo para eliminar todos los productos del carrito
    async deleteProducts(cartId) {
        try {
            const cartFind = await Cart.findOne({ id: cartId })
            const idUpdate = cartFind._id.toString()
            cartFind.products =[];
            const carts = await Cart.findByIdAndUpdate(idUpdate, cartFind, { new: true });
        } catch (error) {
            console.error('Error al eliminar los producto:', error);
            throw error;
        }
    };

    async updateProducts(cartId, productUpdate) {
        try {
            const cartFind = await Cart.findOne({ id: cartId })
            const idUpdate = cartFind._id.toString()
            cartFind.products = productUpdate;
            const carts = await Cart.findByIdAndUpdate(idUpdate, productUpdate, { new: true });
            console.log(carts);
        } catch (error) {
            console.error('Error al modificar el carrito:', error);
            throw error;
        }
    };

    async updateProductsQuantity(cartId,productId, productUpdateQuantity) {
        try {
            const cartFind = await Cart.findOne({ id: cartId })
            const idUpdate = cartFind._id.toString()

            const indiceProduct = cartFind.products.findIndex(product => product.id === productId);
            if (indiceProduct !== -1) {
                cartFind.products[indiceProduct].quantity = productUpdateQuantity;
                const carts = await Cart.findByIdAndUpdate(idUpdate, cartFind, { new: true });
                return carts;
            } else {
                console.log('Producto no encontrado');
            }

            const carts = await Cart.findByIdAndUpdate(idUpdate, productUpdate, { new: true });
            console.log(carts);
        } catch (error) {
            console.error('Error al modificar el carrito:', error);
            throw error;
        }
    };

};