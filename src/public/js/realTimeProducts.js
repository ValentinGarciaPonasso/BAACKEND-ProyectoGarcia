let socket = io.connect("http://localhost:8080", { forceNew: true });


// socket.on ("productoActualizado", () => {
//     window.location.href = "/realTimeProducts";
// })

socket.on("productoActualizado", (products) => {
    render(products);
})

function render(products) {
    // Selecciona el elemento donde quieres renderizar los productos
    const productList = document.getElementById('productList');
    // Vacía el contenido existente
    productList.innerHTML = '';
    // Recorre el array y crea una lista para cada producto
    products.forEach(product => {
        const productUL = document.createElement('ul');
        productUL.classList.add('tarjeta');
        const properties = Object.keys(product);

        properties.forEach(prop => {
            const listItem = document.createElement('li');
            listItem.textContent = `${prop}: ${product[prop]}`;
            productUL.appendChild(listItem);
        });
        productList.appendChild(productUL);
    });
}

function addProduct(e) {
    console.log("Estoy en la funcion addProduct");
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit("nuevoProducto", newProduct);                                     ///enviamos desde el cliente un mensaje
    return false;
}

function deleteProduct(e) {
    console.log("Estoy en la funcion deleteProduct");
    const deleteProduct = document.getElementById('id').value;
    socket.emit("eliminarProducto", deleteProduct);                                     ///enviamos desde el cliente un mensaje
    return false;
};
