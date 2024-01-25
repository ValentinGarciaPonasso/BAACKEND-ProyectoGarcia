import CartDao from "../dao/cart.dao.js";
// import ProductDao from "../dao/product.dao.js";

const Cart = new CartDao();
// const Product = new ProductDao();

const createCart = async (user) => {
    try {
        const carts = await Cart.getAll();
        console.log('carritos: ', carts);
        console.log(user.email);
        //generamos un id único
        const cartId = carts.length + 1;
        const cartProducts = [];
        const cart = {
            id: cartId,
            username: {
                _id: user._id,
                email: user.email
            },
            products: cartProducts,
            total: 0,
        };
        console.log('carrito: ', cart)
        /// Agregamos el carrito al archivo
        const newCart = await Cart.addCart(cart);
        console.log("Carrito creado con éxito");
        return newCart
    } catch (e) {
        console.error("Ocurrió un error al crear el carrito", e);
        throw e;
    };
}

const getCartById = async (id) => {
    try {
        console.log('id en service', id)
        const carts = await Cart.getById(id);
        if(carts) {
            console.log(`Carrito con id = ${id}:`, carts);
            return carts;
        } else {
            console.log(`Carrito con id ${id} no encontrado`);
            return null;
        }
    } catch (error) {
        console.error('Error al consultar carrito por ID', error);
        throw error;
    }
}

const getCartByUser = async (userId) => {
    try {
        console.log("userId: " + userId)
        const cart = await Cart.getByUser(userId);
        if(cart) {
            console.log(`Carrito con id = ${cart[0].id}:`, cart);
            return cart;
        } else {
            console.log(`Carrito con id ${cart.id[0]} no encontrado`);
            return null;
        }
    } catch (error) {
        console.error('Error al consultar carrito por ID', error);
        throw error;
    }
}

const addProductToCart = async (cartId, product) => {
    try {
        console.log("cartId: " + cartId)
        console.log("productid " + product[0]);
        const cart = await Cart.getById(cartId);
        let cartProducts = cart [0].products;
        if (cart) {
            const idProducto = product[0].id;
            if (cartProducts.length > 0) {
                const isProduct = cartProducts.find(isProduct => isProduct.id === idProducto); 
                if (isProduct) {
                    isProduct.quantity = isProduct.quantity + 1;
                    const carts = await Cart.updateCart(cartId, cartProducts);
                    return carts;
                } else {
                    //hacer un update
                    const newproduct = {
                        id: idProducto,
                        quantity: 1,
                        _id: product[0]._id.toString()
                    }
                    cartProducts.push(newproduct);
                    // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                    const carts = await Cart.updateCart(cartId, cartProducts);
                    return carts;
                }
            } else {
                //hacer un update
                const newproduct = {
                    id: idProducto,
                    quantity: 1,
                    _id: product[0]._id.toString(),
                }
                cartProducts.push(newproduct);
                // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                const carts = await Cart.updateCart(cartId, cartProducts);
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

const deleteProduct = async (cartId, productId) => { 
    try {
        const cartFind = await Cart.getById(cartId)
        const indiceProduct = cartFind[0].products.findIndex(product => product.id === productId);
        if (indiceProduct !== -1) {
            cartFind[0].products.splice(indiceProduct, 1);
            const carts = await Cart.updateCart(cartId, cartFind[0].products);
            return carts;
        } else {
            console.log('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw error;
    }
}

const vaciarCarrito = async (cartId) => {
    try {
        const cartFind = await Cart.getById(cartId)
        cartFind[0].products =[];
        const carts = await Cart.updateCart(cartId, cartFind[0].products);
        return carts
    } catch (error) {
        console.error('Error al eliminar los producto:', error);
        throw error;
    }
}


////////FALTAN PROBAR ESTOS 2

const updateProducts = async (cartId, productUpdate) => {
    try {
        const cartFind = await Cart.getById(cartId)
        const idUpdate = cartFind._id.toString()
        cartFind.products = productUpdate;
        const carts = await Cart.updateCart(idUpdate, productUpdate);
        console.log(carts);
        return carts
    } catch (error) {
        console.error('Error al modificar el carrito:', error);
        throw error;
    }
}

const updateProductsQuantity = async (cartId,productId, productUpdateQuantity) => {
    try {
        const cartFind = await Cart.getById(cartId)
        const idUpdate = cartFind._id.toString()

        const indiceProduct = cartFind.products.findIndex(product => product.id === productId);
        if (indiceProduct !== -1) {
            cartFind.products[indiceProduct].quantity = productUpdateQuantity;
            const carts = await Cart.updateCart(idUpdate, cartFind);
            return carts;
        } else {
            console.log('Producto no encontrado');
        }

        const carts = await Cart.updateCart(idUpdate, productUpdate);
        console.log(carts);
        return carts;
    } catch (error) {
        console.error('Error al modificar el carrito:', error);
        throw error;
    }
}

export {createCart, getCartById, getCartByUser, addProductToCart, deleteProduct, vaciarCarrito, updateProducts, updateProductsQuantity};