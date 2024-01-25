let socket = io.connect("http://localhost:8080", { forceNew: true });

socket.on("carritoActualizado", (newCarrito) => {
    console.log(newCarrito);
    location.reload();
    })

console.log("Me encuentro en product.js")
const cartIdElement = document.getElementById('cartId');
const cartId = cartIdElement.dataset.cartId;
console.log("CartId: " + cartId)


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
    console.log("ID del producto: ", productAddedId);
    socket.emit('cartUpdated', { variable1: productAddedId, variable2: cartId });
    return false;
}

function deleteFromCart(event) {
    console.log(cartId);
    const productAddedId = event.target.value;
    console.log("ID del producto: ", productAddedId);
    socket.emit('deleteFromCart', { variable1: productAddedId, variable2: cartId });
    return false;
}

// socket.on("productList", (products) => {
//     console.log("Products desde el back: ", products)
//     console.log("Products desde el front: ", product);
// })