export const generateUserErrorInfo = (user) => {
    return `
        One or more properties were incomplete or not valid.
        List of required properties:
        first_name: needs to be String, received: ${user.first_name}
        last_name: needs to be String, received: ${user.last_name}
        email: needs to be String, received: ${user.email}
    `;
};



export const generateProductErrorInfo = (product) => {
    return `
        One or more properties were incomplete or not valid.
        List of required properties:
        title: needs to be String, received: ${product.title}
        description: needs to be String, received: ${product.description}
        code: needs to be String, received: ${product.code}
        price: needs to be Number, received: ${product.price}
        available: needs to be Boolean, received: ${product.available}
        stock: needs to be Number, received: ${product.stock}
        category: needs to be String, received: ${product.category}
        thumbnail: needs to be Image, received: ${product.thumbnail}
    `;
};


