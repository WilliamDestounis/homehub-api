import mongoose from "mongoose" //import mongoose to create schema

//creating a new schema
const UserSchema = new mongoose.Schema({
    username: {type:String,required: true,unique:true},
    password: {type:String,required: true},
    recievables: [{type:mongoose.Schema.Types.ObjectId,ref:"recievables",required: false}], //holds objectId of any recievables
    payables: [{type:mongoose.Schema.Types.ObjectId,ref:"payables",required: false}], //holds objectId of any payables
    homeId : {type:mongoose.Schema.Types.ObjectId,ref:"homes"}, //holds objectId of home


})

//UserModel is created and exported for use
export const UserModel = mongoose.model("users",UserSchema)