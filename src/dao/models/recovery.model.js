import mongoose from 'mongoose'

const {Schema,model}=mongoose;
const recoveryCollection = "RecoveryLink";

const recoverySchema =new Schema({
    hash:{type:String,required:true},
    fechaExpiracion: {type: Date, required:true},
    username: {
        _id: {type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        email: String
    }
});

const recoveryModel= model (recoveryCollection ,recoverySchema);

export default recoveryModel;