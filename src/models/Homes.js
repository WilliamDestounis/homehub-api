import mongoose from "mongoose"; //import mongoose to create schema

//creating a new schema
const HomeSchema = new mongoose.Schema({
    name: {type:String,required: true, unique: true},
    code:{type:String,required: true},
    chat: [{type:Object,required: false}], //chatObj defined inside interface in homeChat.tsx
    todo: [{type:String,required: false}],
    membersId : [{type:mongoose.Schema.Types.ObjectId,ref: "users",required: true}] //holds objectId type variables

})

//HomeModel is created and exported for use
export const HomeModel = mongoose.model("homes",HomeSchema)