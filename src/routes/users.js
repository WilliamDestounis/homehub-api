import express from "express"
import jwt from "jsonwebtoken" //jwt used for user authorization 
import bcrypt from "bcrypt" //used for password encryption

//import neccesary models 
import { UserModel } from "../models/Users.js"

//creates new router
const router = express.Router()

//imports for ENV variable
import dotenv from "dotenv"
dotenv.config()

// defining env variable to secure jwt secret
const env_variable = process.env.SECRET


//creating a middleware of json web token verification
export const verifyJWT = (req,res,next) =>{

    //collect cookie from front end
    const token = req.headers.authorization;

    //if token exists, verify if token matches the cookie 
    if(token){
        jwt.verify(token,env_variable, (err)=>{

            //if not send error status code
            if (err) {
                return res.sendStatus(403)
            }
            next();
        })   
    }
    else{
        return res.sendStatus(401)
    }
}

//get request used to access a users homeId from user id paramater
router.get("/:id", async (req,res)=>{    

    //find user object
    const user = await UserModel.findById(req.params.id);

    //if the user has a home
    if(user.homeId){
        //return information
        return res.json({
        home:user.homeId
        })
    }
    else return res.json({
        home : -1
    })

})

//post request to used to create a user 
router.post("/register", async (req,res)=>{

    //recieving info from req
    const { username, password } = req.body;

    if(!username){
        //if username does not exist, return a message 
        return res.json({message:"Must Enter A Username"})
    }

    if(!password){
        //if password does not exist, return a message 
        return res.json({message:"Must Enter A Password"})
    }

    try{

    //checking to see if there is a username in the system 
    const user = await UserModel.findOne({username: username});

    if(user){
        //if true, return a message 
        return res.json({message:"This Username Already Exists"})
    }
    }catch(e){
        console.log(e)
        return res.json({message:"error"})
    }
    

    //if not, create a newUser, with a hashed password
    const hashedPass = await bcrypt.hash(password,10)

    const newUser =  new UserModel({
        username:username,
        password: hashedPass
    })

    //save
    await newUser.save();

    res.json({message: "Registration Complete"});
});


//put request used to login a user
router.put("/login", async (req,res)=>{

    //recieving info from req
    const { username, password } = req.body;

    //checking to see if there is a username and storing in user variable
    const user = await UserModel.findOne({username: username});

    //check if the user does not exist
    if(!user){
        return res.json({message: " User Does Not Exist"})
    }

    //check if password is correct
    const isPassValid = await bcrypt.compare(password,user.password)

    if(!isPassValid){
        return res.json({message: "Incorrect Password"})
    }

    //create json web token to be used for authorization 
    const token = jwt.sign({id: user._id},env_variable)

    res.json({token,userId:user._id,message:"User Logged In"})

})

//export router
export { router as userRouter }



