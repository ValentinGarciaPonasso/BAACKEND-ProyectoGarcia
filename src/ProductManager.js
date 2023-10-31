import fs from 'fs';

export default class ProductManager {
    constructor(ruta) {
        this.products = [];
        this.path = ruta;
    };


    ///Metodo para agregar el producto al array
    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        try {
            /// Validamos que los campos sean obligatorios
            this.products = await this.getProduct();
            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
                console.log('Favor completar todos los campos')
                throw new Error('Favor completar todos los campos');
            };

            const id = this.products.length + 1;
            const product = {
                id,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail
            };

            /// busca si existe en el array un producto con el mismo código
            const isProduct = this.products.find(isProduct => isProduct.code === product.code);
            if (isProduct) {
                console.log(`El producto con código ${product.code} ya existe`)
                throw new Error(`El producto con código ${product.code} ya existe`);
            };

            /// Agrega el producto a la lista de productos
            this.products.push(product);

            /// Agregamos el producto al archivo
            await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");
            console.log("Producto creado con éxito");
        } catch (e) {
            console.error("Ocurrió un error al agregar el producto", e);
            throw e;
        };
    };

    ///Metodo que devuelve todos los productos del array
    async getProduct() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);
            console.log("Productos: ", productos);
            return productos;
        } catch (e) {
            console.error("Error al consultar productos", e)
            throw e;
        }
    };

    ///Metodo que devuelve todos los productos con cierto ID
    async getProductById(id) {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);
            const productId = productos.find(product => product.id === id);
            if (productId) {
                console.log(`Producto con id = ${id}:`, productId);
                return productId;
            } else {
                console.log(`Producto con id ${id} no encontrado`);
                return null;
            }
        } catch (error) {
            console.error('Error al consultar productos por ID', error);
            throw error;
        }
    };

    //Metodo para actualizar un producto
    async updateProduct(id, field, newValue) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);

            const productId = products.findIndex(product => product.id === id);
            if (productId === -1) {
                throw new Error(`Producto con id ${id} no encontrado`);
            }

            // Actualizamos el campo correspondiente
            products[productId][field] = newValue;

            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
            console.log(`Producto con id ${id} actualizado en el campo ${field} con el valor ${newValue}`);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    //Metodo para eliminar un producto
    async deleteProduct(id) {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productos = JSON.parse(data);
            const productosActualizado = productos.filter(objeto => objeto.id !== id);
            if (productosActualizado.length === productos.length) {
                throw new Error(`Producto con id ${id} no encontrado`);
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productosActualizado), 'utf-8');
            console.log(`Producto con id = ${id} eliminado. Productos: `, productosActualizado);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
};
