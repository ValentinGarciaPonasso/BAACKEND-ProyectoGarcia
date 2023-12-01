let socket = io.connect("http://localhost:8080", { forceNew: true });


socket.on("productoActualizado", (productos) => {
    // render(products);
    console.log("Products desde el front: ", productos);
})

// function render(products) {
//     // Selecciona el elemento donde quieres renderizar los productos
//     const productList = document.getElementById('productList');
//     // Vacía el contenido existente
//     productList.innerHTML = '';
//     // Recorre el array y crea una lista para cada producto
//     products.forEach(product => {
//         const productUL = document.createElement('ul');
//         productUL.classList.add('tarjeta');
//         const properties = Object.keys(product);

//         properties.forEach(prop => {
//             console.log(prop)
//             if (prop === 'title' || prop === 'price' || prop === 'category') {
//                 const listItem = document.createElement('li');
//                 listItem.textContent = `${prop}: ${product[prop]}`;
//                 productUL.appendChild(listItem);
//             } else {

//             }
//         });

//         // Agrega dos enlaces para cada producto
//         const addToCartLink = document.createElement('a');
//         addToCartLink.href = '#'; // Puedes establecer el enlace a donde quieras
//         addToCartLink.textContent = 'Agregar al carrito';
//         addToCartLink.addEventListener('click', () => {
//             // Lógica para agregar al carrito
//             console.log(`Agregando al carrito: ${product._id}`);
//         });

//         const detailsLink = document.createElement('a');
//         detailsLink.href = '#'; // Puedes establecer el enlace a donde quieras
//         detailsLink.textContent = 'Detalles';
//         detailsLink.addEventListener('click', () => {
//             // Lógica para mostrar detalles
//             console.log(`Mostrando detalles: ${product._id}`);
//         });

//         productUL.appendChild(addToCartLink);
//         productUL.appendChild(detailsLink);
//         productList.appendChild(productUL);
//     });
// }