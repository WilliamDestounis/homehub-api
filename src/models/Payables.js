import mongoose from "mongoose" //import mongoose to create schema

//creating a new schema
const PayablesSchema = new mongoose.Schema({
    userSent:{type:mongoose.Schema.Types.ObjectId,ref: "users",required: true}, //holds objectId of the user who sent 
    recId:{type:mongoose.Schema.Types.ObjectId,ref: "recievables"}, //holds the objectId of the associated recievable model
    expName: {type:String,required: true},
    exp:{type:String,required: true},
    splitAmount: {type:Number,required: true},
})

//PayablesModel is created and exported for use
export const PayablesModel = mongoose.model("payables",PayablesSchema)
