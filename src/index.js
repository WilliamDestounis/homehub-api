import express from "express" //framework to create api
import cors from "cors" //establish rules between front/back - end
import mongoose from "mongoose" //used for object relational mapping 

//imports for the different routes
import { userRouter } from "./routes/users.js"
import { homeRouter } from "./routes/home.js"
import {todoRouter} from "./routes/todo.js"
import {chatRouter} from "./routes/chat.js"
import { ledgerRouter } from "./routes/ledger.js"
import { removeRouter } from "./routes/remove.js"

const app = express();

//middlewares
app.use(express.json()) //built in express middleware to parse incoming json requests
app.use(cors()) //enables requests from different domains 


//creating route paths 

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials","true");
    res.send("Welcome to the HomeHub API!");
  });

app.use("/auth",userRouter)

app.use("/home",homeRouter)

app.use("/todo",todoRouter)

app.use("/chat",chatRouter)

app.use("/ledger",ledgerRouter)

app.use("/remove",removeRouter)


//imports for ENV variable
import dotenv from "dotenv"
dotenv.config()

// defining env variable to secure 
const env_variable = process.env.PASS

//using mongoose to connect to MongoDB database
mongoose.connect(`mongodb+srv://testAdmin:${env_variable}@homehubserver.yi9s3vq.mongodb.net/homehubserver?retryWrites=true&w=majority`);

//hosting on local server
app.listen(3001,()=>console.log("Sever Started"))
