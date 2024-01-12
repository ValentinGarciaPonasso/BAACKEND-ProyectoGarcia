import fs from 'fs';

export default class CartManager {
    constructor(ruta) {
        this.carts = [];
        this.path = ruta;
    };


    async createCart (){
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            //generamos un id único
            const cartId = this.carts.length + 1;
            const cartProducts = [];
            const cart = {
                id: cartId,
                products: cartProducts,
            }
            /// Agrega el carrito a la lista de carritos
            this.carts.push(cart);
            /// Agregamos el carrito al archivo
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts), "utf-8");
            console.log("Carrito creado con éxito");
        } catch (e) {
            console.error("Ocurrió un error al crear el carrito", e);
            throw e;
        };
    };

    async getCartById(id) {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
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
            const data = await fs.promises.readFile(this.path, "utf-8");
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id === cartId);
            console.log(`Buscamos carrito con id ${cartId}: ` ,cart);
            if(cart) {
                console.log("cart.Products: ", cart.products);
                const isProduct = cart.products.find(isProduct => isProduct.id === product.id);
                console.log("isProduct: ", isProduct);
                if (isProduct) {
                    isProduct.quantity = isProduct.quantity + 1;
                    console.log("Producto sumado con éxito, nuevo isProduct: ", isProduct);
                    await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    console.log("cart: ", cart);
                } else {
                    const newproduct = {
                        id: product.id,
                        quantity: 1
                    }
                    cart.products.push(newproduct);
                    console.log("cart.Products despues de agregado: ", cart.products);
                    console.log("Carrito con el producto agregado: ", cart);
                    console.log("Todos los carritos: ", carts);
                    await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    console.log("Producto agregado con éxito");
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