import mongoose from "mongoose" //import mongoose to create schema

//creating a new schema
const RecievablesSchema = new mongoose.Schema({
    expName: {type:String,required: true},
    exp:{type:Number,required: true},
    splitAmount: {type:Number,required: true},
    splitMembers: [{type:String,required: true}],
})

//RecievablesModel is created and exported for use
export const RecievablesModel = mongoose.model("recievables",RecievablesSchema)