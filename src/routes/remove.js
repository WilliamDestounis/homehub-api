import express from "express"

//import neccesary models 
import { PayablesModel } from "../models/Payables.js"
import { RecievablesModel } from "../models/Recievables.js"

//import middleware - for authorization
import {verifyJWT } from "./users.js"

//create router
const router = express.Router()


//delete request to delete recievable objects
router.delete("/paySplitR/:recId",verifyJWT,async(req,res)=>{

    //recievable object is found and deleted
    await RecievablesModel.deleteOne({ _id: req.params.recId})

    res.json({
        message:"complete"
    })
})

//delete request to delete payable objects
router.delete("/paySplitP/:payId",verifyJWT,async(req,res)=>{

    //recievable object is found and deleted
    await PayablesModel.deleteOne({ _id: req.params.payId })

    res.json({
        message:"complete"
    })
})

//export router
export {router as removeRouter}


