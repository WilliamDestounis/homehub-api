import express from "express"

//import neccesary models 
import { HomeModel } from "../models/Homes.js"
import { UserModel } from "../models/Users.js"
import { PayablesModel } from "../models/Payables.js"
import { RecievablesModel } from "../models/Recievables.js"

//import middleware - for authorization
import {verifyJWT } from "./users.js"

//create router
const router = express.Router()


//get request to return 

router.get("/:id", verifyJWT ,async (req,res)=>{

    //find current user and home objects
    const user = await UserModel.findById(req.params.id) 
    const home = await HomeModel.findById(user.homeId)


    //create a temp variable to store the array of house members

    let tempMemberId = await home.membersId
        
    //map this array to access the name and memberId of each member
    const houseMembers = await Promise.all(tempMemberId.map(async (element)=>{

    let tempUser = await UserModel.findById(element)

    let name = await tempUser.username

    return {
        memberId:element,
        name:name
    }}))


    //create a temp variable to store the array of recievables object Ids

    let tempRecievables = await user.recievables

    //map this array to access the recievable objects 
    const recievables = await Promise.all(tempRecievables.map(async (element)=>{

        let tempRecievables = await RecievablesModel.findById(element)

        return tempRecievables
    }))


     //create a temp variable to store the array of payable object Ids
    let tempPayables = await user.payables

    ////map this array to access the payable objects 
    const payables = await Promise.all(tempPayables.map(async (element)=>{

        let tempPayables = await PayablesModel.findById(element)

        return tempPayables
    }))

    //return information

    return res.json({
        homeMembers: houseMembers,
        recievables:recievables,
        payables:payables

    })
    }

)

//post request to create a recievable object

router.post("/addSplit", verifyJWT ,async (req,res) =>{

    //information is collected from the front end
    const {userId,expName,exp,splitMembers,splitAmount} = req.body

    //curent user object is found
    const user = await UserModel.findById(userId) 

    //a new recievable object is created
    const newReceivable =  new RecievablesModel({
        expName:expName,
        exp: exp,
        splitMembers:splitMembers,
        splitAmount:splitAmount
    })

    //saved
    await newReceivable.save()

    //user recievables array is modified
    user.recievables.push(newReceivable.id)

    //saved
    user.save()

    return res.json({
        recId:newReceivable.id
    })

})


//post request to create a payables object

router.post("/split",verifyJWT, async (req,res) =>{

    //information is collected from the front end
    const {userId,recId,expName,exp,splitMembers,splitAmount} = req.body

    //for each member in the array split members
    for(let member of splitMembers){

        //find the current member object
        let memb = await UserModel.findById(member) 

        //create a payable object
        const newPayables =  new PayablesModel({
            userSent: userId,
            recId:recId,
            expName:expName,
            exp: exp,
            splitAmount:splitAmount
        })

        //save
        await newPayables.save()

        //update member payables array
        memb.payables.push(newPayables.id)

        //save
        memb.save()

    }

    res.json({
        message:"complete"
    })

})


//put request to update database objects
router.put("/paySplit",verifyJWT , async (req,res) =>{

    //information is collected from the front end
    const {userId,payIndex} = req.body

    //flag variable created to check if fully paid off
    let paid= false;

    //user object found 
    const user = await UserModel.findById(userId) 

    //selected payableId and associated payable object is found
    const payableId = await user.payables[payIndex]
    const payable = await PayablesModel.findById(payableId)

    //if payable doesnt exist, return
    if(!payable){
        return
    }

    //the payables array is mapped to exclude the chosen payable
    const newPayables = await Promise.all(user.payables.map(async (element)=>{

        if(element != payable.id){
            return element  
        }
        else{
            return []   
        }
     
    }))

    //array is formatted and saves
    user.payables = await newPayables.flat()
    await user.save()  


    //userSent object is found
    const userSent = await UserModel.findById(payable.userSent)

    //the recievables array is mapped to accomodate changes
    const newRecievables = await Promise.all(userSent.recievables.map(async (element)=>{

        //if the payables recId matches, continue
        if(element.equals(payable.recId)){

            //find the associated receivable object
            const recievable = await RecievablesModel.findById(element)
            
            //update balance and save
            let balance = Number(recievable.exp) - recievable.splitAmount
            recievable.exp = String(balance)
            await recievable.save()

            if(balance == 0){
                //boolean flag to show its fully paid
                paid = true
                 //remove from array
                return []
            }

            return element  
        }
        else{
            return element   
        }
     
    }))

    //format and save array
    userSent.recievables = newRecievables.flat()
    await userSent.save()

    //return information
    return res.json({
        payId:payableId,
        recId: payable.recId,
        paid:paid
    })

})

//export router
export {router as ledgerRouter}

