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
        console.log("Carrito con el populate: ",carts)
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
        const cart = await Cart.getById(cartId);
        console.log("Cart desde service" + cart);
        // const idUpdate = cart._id.toString()
        if (cart) {
            const idProducto = product[0].id;
            console.log("id producto a actualizar " + idProducto);
            console.log("productos dentro del cart " + cart[0].products);
            console.log("largo del carrito" + cart[0].products.length)
            const isProduct = cart.products.find(isProduct => isProduct.id === idProducto); 
            if (isProduct) {
                isProduct.quantity = isProduct.quantity + 1;
                const carts = await Cart.updateCart(cartId, cart);
                return carts;
            } else {
                //hacer un update
                const newproduct = {
                    id: idProducto,
                    quantity: 1,
                    _id: product._id.toString(),
                }
                cart[0].products.push(newproduct);
                // await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
                const carts = await Cart.updateCart(cartId, cart);
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
        const idUpdate = cartFind._id.toString()
        const indiceProduct = cartFind.products.findIndex(product => product.id === productId);
        if (indiceProduct !== -1) {
            cartFind.products.splice(indiceProduct, 1);
            const carts = await Cart.updateCart(idUpdate, cartFind);
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
        const idUpdate = cartFind._id.toString()
        cartFind.products =[];
        const carts = await Cart.updateCart(idUpdate, cartFind);
        return carts
    } catch (error) {
        console.error('Error al eliminar los producto:', error);
        throw error;
    }
}

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