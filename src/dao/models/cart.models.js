import mongoose from "mongoose";

const { Schema, model } = mongoose;
const cartsCollection = "Carts";

const cartSchema = new Schema({
    id: { type: Number, required: true },
    products: {type: Object, required: true}
});

const Carts = model(cartsCollection, cartSchema);

export default Carts;