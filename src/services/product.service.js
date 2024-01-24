import ProductDao from "../dao/product.dao.js";

const Product = new ProductDao();

const getAll = () => {
    return Product.getAll();
};

const getRealTimeProducts = () => {
    return Product.getRealTimeProducts();
};

const getByID = (id) => {
    return Product.getByIdDao(id);
};

const addProduct = async (title, description, code, price, available, stock, category, thumbnail) => {

    try {
        /// Validamos que los campos sean obligatorios

        let products = await Product.getAll();
        if (!title || !description || !code || !price || !available || !stock || !category || !thumbnail) {
            console.log('Favor completar todos los campos')
            throw new Error('Favor completar todos los campos');
        };

        const id = products.length + 1;
        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            available,
            stock,
            category,
            thumbnail
        };
        console.log("Productos en el manager", newProduct);
        console.log("Productos en el manager", products);

        /// busca si existe en el array un producto con el mismo código
        const isProduct = products.find(isProduct => isProduct.code === newProduct.code);
        if (isProduct) {
            console.log(`El producto con código ${newProduct.code} ya existe`)
            throw new Error(`El producto con código ${newProduct.code} ya existe`);
        };

        /// Agrega el producto a la lista de productos
        console.log("Producto creado con éxito");
        return Product.addProduct(newProduct)
    } catch (e) {
        console.error("Ocurrió un error al agregar el producto", e);
        throw e;
    };
};

const updateProduct = async (idUpdate, productUpdate) => {
    try {
        console.log(`Producto con id ${idUpdate} actualizado`);
        return Product.updateProduct(idUpdate, productUpdate);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
}


const removeProduct = async (idDelete) => {
    try {
        console.log(`Producto con id ${idDelete} eliminado`);
        return Product.removeProduct(idDelete);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw error;
    }
}




const paginate = (pageNumber, pageSize, sortOrder, category, available) => {
    try {
        let options = {
            page: parseInt(pageNumber),
            limit: parseInt(pageSize),
        };
        if (sortOrder === 'asc') {
            options.sort = { price: 1 };
        } else if (sortOrder === 'desc') {
            options.sort = { price: -1 };
        }
        let query = {}
        if (category) {
            query.category = category
            if (available) {
                query.available = available
            }
        } else {
            if (available) {
                query.available = available
            }
        };
        return Product.paginate(query, options);
    } catch (e) {
        console.error("Error al consultar productos", e)
        throw e;
    }
};

export { getAll,getRealTimeProducts, getByID, addProduct, updateProduct, removeProduct, paginate };