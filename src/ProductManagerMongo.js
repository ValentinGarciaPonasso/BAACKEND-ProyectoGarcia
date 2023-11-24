import fs from 'fs';
import Products from './models/product.models.js';

export default class ProductManagerMongo {
    constructor() {
        this.products = [];
    };


    ///Metodo para agregar el producto al array
    async addProduct(title, description, code, price, status, stock, category, thumbnail, esVisible) {
        try {
            /// Validamos que los campos sean obligatorios
            this.products = await this.getProduct();
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
                console.log('Favor completar todos los campos')
                throw new Error('Favor completar todos los campos');
            };

            const id = this.products.length + 1;
            const product =  new Products({
                id,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail
            }); 
            console.log("Producto en el manager", product);

            /// busca si existe en el array un producto con el mismo código
            const isProduct = this.products.find(isProduct => isProduct.code === product.code);
            if (isProduct) {
                console.log(`El producto con código ${product.code} ya existe`)
                throw new Error(`El producto con código ${product.code} ya existe`);
            };

            /// Agrega el producto a la lista de productos
            const newProducts = await product.save();
            console.log("Producto creado con éxito");
            return newProducts
        } catch (e) {
            console.error("Ocurrió un error al agregar el producto", e);
            throw e;
        };
    };

    ///Metodo que devuelve todos los productos del array
    async getProduct() {
        try {
            const products = await Products.find ();
            console.log("Productos: ", products);
            return products;
        } catch (e) {
            console.error("Error al consultar productos", e)
            throw e;
        }
    };

    ///Metodo que devuelve todos los productos con cierto ID
    async getProductById(idFind) {
        try {
            const products = await Products.find ({id: idFind});
            console.log("Productos: ", products);
            return products;
        } catch (e) {
            console.error("Error al consultar productos", e)
            throw e;
        }
    };

    //Metodo para actualizar un producto
    async updateProduct(idFind, productUpdate) {
        try {
            const productFind = await Products.findOne ({id: idFind})
            const idUpdate =  productFind._id.toString()
            const products = await Products.findByIdAndUpdate (idUpdate,productUpdate, {new:true}  );
            console.log(`Producto con id ${idFind} actualizado`);
            return products;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    //Metodo para eliminar un producto
    async deleteProduct(idFind) {
        try {
            const productFind = await Products.findOne ({id: idFind})
            const idDelete =  productFind._id.toString()
            const products = await Products.findByIdAndDelete (idDelete);
            console.log(`Producto con id ${idFind} eliminado`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
};
