import express, { json } from "express"

//import neccesary models 
import { HomeModel } from "../models/Homes.js"
import { UserModel } from "../models/Users.js"

//import middleware - for authorization
import {verifyJWT } from "./users.js"

//create router
const router = express.Router()


//get request to return todos

router.get("/:userId",verifyJWT, async (req,res)=>{

    //user and home objects found
    const user = await UserModel.findById(req.params.userId)
    const home = await HomeModel.findById(user.homeId)

    //if home exists return information
    if(home){
        return res.json({
            message:"todo returned",
            todo:home.todo
        })
    }
  
});

//put request to update database object information

router.put("/addTodo",verifyJWT, async (req,res)=>{

    //information collected from 
    const {userId,newTodo} = req.body;

    //user and home objects found
    const user = await UserModel.findById(userId)
    const home = await HomeModel.findById(user.homeId)

    if(home){

        //new todo is added to the homes todolist and saved
        home.todo.push(newTodo)
        await home.save()

        return res.json({
                newTodoList: home.todo
            })
    }else{
        return res.json({
                message:"Must Be In A Home To Add A Todo"
            })
        }     
});

//put request is used to delete a todo from the home objects todo list 
router.put("/deleteTodo",verifyJWT, async (req,res)=>{

    //information is grabbed from the front end
    const {userId,element} = req.body;

    //user and home objects found
    const user = await UserModel.findById(userId)
    const home = await HomeModel.findById(user.homeId)

    //if the todo array is not empty
    if(home.todo.length > 0){

        //if the element exists 
        if(element){

            //if the element exists, filter the array to eliminate the element
            const newList = home.todo.filter((e)=>e!=element)

            //update the todo list and save
            home.todo = newList
            await home.save()
        
            return res.json(
                {
                    deleted_todo_message:"Deleted Todo",
                    newTodolist: home.todo
                })
            }
        else{
            return res.json({
             message:"No Selected Todo",
            })
        }}      
    else{
        return res.json({
            message:"No Available Todos To Delete",
        })
    }      
})


export { router as todoRouter }
