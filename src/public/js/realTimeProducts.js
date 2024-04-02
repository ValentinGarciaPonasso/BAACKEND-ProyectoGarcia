// let socket = io.connect("http://localhost:8080", { forceNew: true });
let socket = null;

fetch('/config')
    .then(response => response.json())
    .then(data => {
        const backendUrl = data.backendUrl;
        socket = io.connect(backendUrl, { forceNew: true });


        socket.on("productoActualizado", (products) => {
            console.log(products);
            let listaDeProductos = products
            render(listaDeProductos);
        })
        
        socket.on("productoNoEliminado", (eliminado) => {
            if (!eliminado) {
                const noEliminado = document.getElementById('Eliminado');
                noEliminado.innerHTML = '<h4>El usuario solo puede eliminar productos que le pertenezcan</h4>'
            }
        })
        
        socket.on("productoEliminado", (eliminado) => {
            if (eliminado) {
                const noEliminado = document.getElementById('Eliminado');
                noEliminado.innerHTML = '<h4>Producto eliminado con exito</h4>'
            }
        })
    })
    .catch(error => {
        console.error('Error al obtener la configuración del backend:', error);
    });



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
            if (prop === '_id' || prop === '__v') {

            } else {
                const listItem = document.createElement('li');
                listItem.textContent = `${prop}: ${product[prop]}`;
                productUL.appendChild(listItem);
            }
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
        status: document.getElementById('available').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value,
        owner: document.getElementById('owner').value
    }
    socket.emit("nuevoProducto", newProduct);                                     ///enviamos desde el cliente un mensaje
    return false;
}

function deleteProduct(e) {
    console.log("Estoy en la funcion deleteProduct");
    const deleteProductId = document.getElementById('id').value;
    const role = document.getElementById('role').value;
    const email = document.getElementById('owner').value;
    let data = {
        deleteProductId: deleteProductId,
        email: email,
        role: role
    }
    console.log(data)
    socket.emit("eliminarProducto", data);                         ///enviamos desde el cliente un mensaje
    return false;
};
