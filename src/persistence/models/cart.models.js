import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;
const cartsCollection = "Carts";

const cartSchema = new Schema({
    id: { type: Number, required: true },
    products: [{
        quantity: { type: Number, required: true },
        id: { type: Number, required: true }, // Propiedad "id" del producto
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    }]
});

cartSchema.plugin(mongoosePaginate);

const Carts = model(cartsCollection, cartSchema);

export default Carts;