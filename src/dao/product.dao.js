import Product from "../dao/models/product.models.js";

class ProductsDAO {
    constructor() { 
        this.products = [];
    }

    async getAll() {
        try {
            return await Product.find();
        }
        catch (error) {
            throw error;
        }
    }

    async getRealTimeProducts() {
        try{
            // const productosEncontrados = await Product.find({})
            // return productosEncontrados
            return await Product.find()
        }
        catch (error) {
            throw error;
        }
    }

    async getByIdDao(idFind) {
        try {
            const producroEncontrado = await Product.find({ id: idFind })
            return producroEncontrado
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(productInfo) {
        try {
            return await Product.create(productInfo);
        } catch (error) {
            throw error;
        }
    }
    async updateProduct(idUpdate, productInfo) {
        try {
            return await Product.updateOne({id:idUpdate},{$set: productInfo})
        } catch (error) {
            throw error;
        }
    }
    async removeProduct(idDelete) {
        try {
            return await Product.deleteOne({id:idDelete})
        } catch (error) {
            throw error;
        }
    }

    ///////////////Paguinate
    async paginate(query , options) {
        return await Product.paginate(query, options)
    }
}

export default ProductsDAO;