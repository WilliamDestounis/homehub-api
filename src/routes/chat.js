import express from "express" 

//import neccesary models 
import { HomeModel } from "../models/Homes.js"
import { UserModel } from "../models/Users.js"

//import middleware - for authorization
import {verifyJWT } from "./users.js"

//create a router
const router = express.Router()


//get request to return current chatlist to user

router.get("/:id",verifyJWT,async (req,res)=>{

    //user and home objects found

    const user = await UserModel.findById(req.params.id)
    const home = await HomeModel.findById(user.homeId)

    if(home){
        //if home exists
        return res.json({
            message:"chat returned",
            chat:home.chat,
            name:user.username
        })
    }   
})

//put request to add a chat to the chat array of the users home model

router.put("/addChat",verifyJWT,async (req,res)=>{

    const {userId, chat} = req.body;

    //user and home objects found

    const user = await UserModel.findById(userId)
    const home = await HomeModel.findById(user.homeId)

    if(home){
        //if home object exists, then add chat

        await home.chat.push({
            chat: chat,
            chatId: userId,
            name: user.username
        })

        //save
        await home.save()

        //return appropriate message 

        return res.json({chat_message:"chat added"})

    }else{
        return res.json({message:"Must Be In a Home To Add A Chat"})
    }
})

//export router
export {router as chatRouter}
