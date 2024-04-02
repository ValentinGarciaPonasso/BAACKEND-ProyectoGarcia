// let socket = io.connect("http://localhost:8080", { forceNew: true });
let socket = null;

fetch('/config')
    .then(response => response.json())
    .then(data => {
        const backendUrl = data.backendUrl;
        socket = io.connect(backendUrl, { forceNew: true });
    })
    .catch(error => {
        console.error('Error al obtener la configuración del backend:', error);
    });

socket.on("carritoActualizado", (newCarrito) => {
    console.log(newCarrito);
    location.reload();
    })

console.log("Me encuentro en product.js")
const cartIdElement = document.getElementById('cartId');
const cartId = cartIdElement.dataset.cartId;
console.log("CartId: " + cartId)
const userEmail = document.getElementById('email').value;



document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', function (event) {
        addToCart(event);
    });
});

document.querySelectorAll('.deleteFromCart').forEach(button => {
    button.addEventListener('click', function (event) {
        deleteFromCart(event);
    });
});


function addToCart(event) {
    console.log(cartId);
    const productAddedId = event.target.value;
    let ownerId = "owner" + productAddedId
    const owner = document.getElementById(ownerId).value;
    console.log("ownerdel producto: " + owner);
    console.log("Email del usuario: " + userEmail);
    console.log("ID del producto: ", productAddedId);
    if( owner === userEmail) {
        console.log("No puedes agregar un producto que te pertence ");
        const ProductoNoAgregado = document.getElementById(`ProductoNoAgregado${productAddedId}`);
        ProductoNoAgregado.innerHTML = '<h4>No puedes agregar un producto que te pertence </h4>'
    } else {
        console.log("Se agregará el producto al carrito");
        socket.emit('cartUpdated', { variable1: productAddedId, variable2: cartId });
        return false;
    }
}

function deleteFromCart(event) {
    console.log(cartId);
    console.log("evento: " + event.target);
    const productAddedId = event.target.value;
    console.log("ID del producto: ", productAddedId);
    socket.emit('deleteFromCart', { variable1: productAddedId, variable2: cartId });
    return false;
}

