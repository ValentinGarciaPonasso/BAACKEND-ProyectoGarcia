import Cart from "../dao/models/cart.models.js";

class CartsDAO {
    constructor(){
        this.carts = [];
    };

    async getAll () {
        return await Cart.find();
    }
    
    async addCart(cart){
        const newCart =await Cart.create(cart);
        return  newCart;   
    };

    async getById(idFind) {
        try {
            const cartEncontrado = await Cart.find({ id: idFind }).populate("products._id");
            return cartEncontrado
        } catch (error) {
            console.log(error);
        }
    };

    async getByUser (userId) {
        try {
            const cartEncontrado = await Cart.find({ "username._id" : userId }).populate("products._id");
            return cartEncontrado
        } catch (error) {
            console.log(error);
        }
    }

    async updateCart(idUpdate, newProduct) {
        try {
            return await Cart.updateOne({id:idUpdate},{$set: {products: newProduct}})
        } catch (error) {
            throw error;
        }
    };
}

export default CartsDAO;