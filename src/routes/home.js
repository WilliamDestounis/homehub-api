import express from "express"
import bcrypt from "bcrypt" //used for password encryption

//import neccesary models 
import { HomeModel } from "../models/Homes.js"
import { UserModel } from "../models/Users.js"

//import middleware - for authorization
import {verifyJWT} from "../routes/users.js"

//create a router
const router = express.Router()


//post request to create a new home

router.post("/create",verifyJWT , async (req,res)=>{

    //name, passcode and userId are collected from frontend
    const { name, code, userId } = req.body;

    //code to check if proposed house name already exists
    const houseName = await HomeModel.findOne({name:name})

    if(houseName){
        //if true, return a message 
        return res.json({message:"This Home Already Exists"})
    }

    //hash the passcode using bycrypt

    const hashedCode = await bcrypt.hash(code,10)

    //create initial values
    const chat = [];
    const memberArray = [userId]
    const todo = []

    //create a homeModel object
    const newHome = new HomeModel({
        name:name,
        code: hashedCode,
        chat: chat,
        todo: todo,
        membersId: memberArray,
    }) 

    //save
    await newHome.save();

    //updating user object
    const user = await UserModel.findById(userId)
    user.homeId = newHome._id;
    await user.save()

    //returning message
    return res.json({
        message: "Home Added Succesfully",
        complete:true
    })

})

//put request to join a home 

router.put("/join",verifyJWT , async (req,res)=>{

    //variables from front-end
    const {name, code, userId } = req.body;

    //user and home model objects found
    const user = await UserModel.findOne({_id: userId});
    const home = await HomeModel.findOne({name: name});

    if(!home){
        //check if home exists
        return res.json({message: "Home does not exist"})
    }

    //check if the passscode matches to the saved passcode, using bycrypt

    const isCodeValid = await bcrypt.compare(code,home.code)

    if(!isCodeValid){
        //return message if not valid
        return res.json({message: "Incorrect PassCode"})
    }

    //update user object info

    user.homeId = home._id
    await user.save()

    //update home object info

    home.membersId.push(user._id)
    await home.save()

    //return message
    return res.json({
        message: "Home joined",
        suc: true
    })

})

//export router
export { router as homeRouter }