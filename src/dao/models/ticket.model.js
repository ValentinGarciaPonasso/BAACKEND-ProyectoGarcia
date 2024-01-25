import mongoose from 'mongoose'

const {Schema,model}=mongoose;
const ticketCollection = "Tickets";

const ticketSchema =new Schema({
    code:{type:String,required:true},
    purchase_datetime: {type:String,required:true},
    amount: {type:Number,default: 0},
    purchaser: {type:String,required:true},
    products: [{
        title: {type:String},
        price: {type:Number},
        inStok: {type:String}
    },]
});

const ticketModel= model (ticketCollection ,ticketSchema);

export default ticketModel;