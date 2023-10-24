import ProductManager from "./ProductManager.js";

async function test (){
    const productManager = new ProductManager('./Productos.json');
    const productoObtenido =  await productManager.getProduct();
    console.log("Productos: ", productoObtenido);
};

test ();