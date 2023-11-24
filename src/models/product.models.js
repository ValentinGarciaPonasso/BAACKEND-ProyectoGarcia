import mongoose from "mongoose";

const { Schema, model } = mongoose;
const prodcutsCollection = "Products";

const productSchema = new Schema({
    // id: {type: Number, required: true},
    // title: {type: String, required: true},
    // esVisible: {type: Boolean, default: false},
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
});

const Products = model(prodcutsCollection, productSchema);

export default Products;