let socket = io.connect("http://localhost:8080", {forceNew: true});


socket.on ("productoActualizado", () => {
    window.location.href = "/realTimeProducts";
})

function addProduct (e){
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

function deleteProduct (e){
    console.log("Estoy en la funcion deleteProduct");
    const deleteProduct = document.getElementById('id').value;
    socket.emit("eliminarProducto", deleteProduct);                                     ///enviamos desde el cliente un mensaje
    return false;
};
