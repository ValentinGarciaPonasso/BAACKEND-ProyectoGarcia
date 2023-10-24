import fs from 'fs';

export default class ProductManager {
    constructor(ruta) {
        this.products = [];
        this.path = ruta;
    };


    ///Metodo para agregar el producto al array
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            /// Validamos que los campos sean obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error('Favor completar todos los campos');
            };

            const id = this.products.length + 1;
            const product = {
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };

            /// busca si existe en el array un producto con el mismo código
            const isProduct = this.products.find(isProduct => isProduct.code === product.code);
            if (isProduct) {
                throw new Error(`El producto con código ${product.code} ya existe`);
            };

            /// Agrega el producto a la lista de productos
            this.products.push(product);

            /// Devuelve el producto agregado
            // await product;
            /// Agregamos el producto al archivo
            await fs.promises.writeFile(this.path, JSON.stringify(this.products), "utf-8");
            console.log("Producto creado con éxito");
        } catch (e) {
            console.error("Ocurrió un error al agregar el producto", e);
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
        //     productId ? console.log(`Producto con id = ${id}:`, productId) : console.log(`Producto con id ${id} no encontrado`);
        //     await productId || null;
        // } catch (e) {
        //     console.error("Error al consultar productos por ID", e)
        // }
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
        }
    }
};




// async function test() {
//     try {
//         // Recibe la ruta './Productos.json' para guardar los archivos en dicha carpeta
//         const productManager = new ProductManager('./Productos.json');

//         // Mostramos en consola previo a agregar producto
//         console.log("Antes de agregar producto:");
//         await productManager.getProduct();

//         // Agregamos producto
//         console.log("Agregando producto...");
//         await productManager.addProduct("Camiseta Futbol", "Nueva camiseta temporada 2023", 1500, "www.img.com", "CF101", 500);

//         // Mostramos en consola luego de agregar producto
//         console.log("Después de agregar producto:");
//         await productManager.getProduct();

//         // Intentamos agregar un producto en los que faltan datos
//         console.log("Agregamos producto donde faltan datos...");
//         await productManager.addProduct("Camiseta Futbol", 1500, "www.img.com", "CF101");

//         // Intentamos agregar un producto con código repetido
//         console.log("Agregando producto con código repetido...");
//         await productManager.addProduct("Pantalon Futbol", "Nuevo pantalón temporada 2023", 1000, "www.img.com", "CF101", 500);

//         //         // Buscamos producto por ID existente y mostramos en pantalla
//         console.log("Buscamos producto con id existente...");
//         const idSearch = 1;
//         await productManager.getProductById(idSearch);

//         // Agregamos 2do producto
//         console.log("Agregando producto...");
//         await productManager.addProduct("Camiseta Futbol 2", "Nueva camiseta alternativa temporada 2023", 2500, "www.img.com", "CF102", 300);

//         // Mostramos en consola luego de agregar producto
//         console.log("Después de agregar producto:");
//         await productManager.getProduct();

//         //         // Buscamos producto por ID inexistente y mostramos en pantalla
//         console.log("Buscamos producto con id inexistente...");
//         const idSearch2 = 99; // Cambiado a un ID inexistente
//         await productManager.getProductById(idSearch2);

//         //         // Buscamos el segundo producto por ID existente y mostramos en pantalla
//         console.log("Buscamos  el segundo producto con id existente...");
//         const idSearch3 = 2;
//         await productManager.getProductById(idSearch3);

//         //Modificamos el primer producto
//         console.log("Modificamos el primer producto");
//         await productManager.updateProduct(idSearch, 'price', 5000);

//         // Mostramos en consola todos los productos luego de modificar el producto
//         console.log("Después de modificar el producto:");
//         await productManager.getProduct();

//         //Eliminamos el segundo producto
//         console.log("Eliminamos el segundo producto");
//         await productManager.deleteProduct(idSearch3);

//         //Eliminamos un producto inexistente
//         console.log("Eliminamos un producto inexistente");
//         await productManager.deleteProduct(idSearch3);

//     } catch (error) {
//         console.error("Ocurrió un error:", error);
//     }
// }
// test();