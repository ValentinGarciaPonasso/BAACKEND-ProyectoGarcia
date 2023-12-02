let socket = io.connect("http://localhost:8080", { forceNew: true });

console.log("Me encuentro en product.js")


document.querySelectorAll('.addToCart').forEach(button => {
    button.addEventListener('click', function(event) {
        addToCart(event);
    });
});

function addToCart(event) {
    const productAddedId = event.target.value;
    console.log("ID del producto: ", productAddedId);
    socket.emit('cartUpdated', productAddedId);
    return false;
}

// socket.on("productList", (products) => {
//     console.log("Products desde el back: ", products)
//     console.log("Products desde el front: ", product);
// })