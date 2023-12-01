let socket = io.connect("http://localhost:8080", { forceNew: true });

socket.on("listadoProductos", (products) => {
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
            console.log(prop)
            if(prop === 'title' || prop === 'price' || prop === 'category'){
                const listItem = document.createElement('li');
                listItem.textContent = `${prop}: ${product[prop]}`;
                productUL.appendChild(listItem);
            } else {

            }
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Agregar al carrito';
        addButton.addEventListener('click', () => {
            // Lógica para agregar al carrito
        console.log(`Agregando al carrito: ${product._id}`);
        });

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Detalles';
        detailsButton.addEventListener('click', () => {
            // Lógica para mostrar detalles
        console.log(`Mostrando detalles: ${product._id}`);
        });

        productUL.appendChild(addButton);
        productUL.appendChild(detailsButton);

        productList.appendChild(productUL);
    });
}