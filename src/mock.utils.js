import { faker } from "@faker-js/faker";

faker.location = "es";

const productList = (numOfProducts) => {
    const products = [];

    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProducts());
    }

    return products
}


const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.lines(),
        code: faker.string.alphanumeric(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 10, max: 99, exclude: [0] }),
        category: faker.commerce.department(),
        image: faker.image.urlLoremFlickr({ category: 'abstract' }),
    };
};

export default productList;