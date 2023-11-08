let socket = io.connect("http://localhost:8080", {forceNew: true});


socket.on("productos", (data) => {
    render (data);
})

function render(data) {
    const html = data.map((data, index) => {
        return `
            <div> 
                <strong>${data.author}</strong>
                <em>${data.text}</em>
            </div>
        `;
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function addProduct (e){
    console.log("Estoy en la funcion addMessage");
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