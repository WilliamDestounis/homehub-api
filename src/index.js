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


//imports for ENV variable
import dotenv from "dotenv"
dotenv.config();

// defining env variable to secure 
const env_variable = process.env.PASS


//creating route paths 

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials","true");
    res.send(`Welcome to the HomeHub API! - ${env_variable}`);
  });

app.use("/auth",userRouter)

app.use("/home",homeRouter)

app.use("/todo",todoRouter)

app.use("/chat",chatRouter)

app.use("/ledger",ledgerRouter)

app.use("/remove",removeRouter)

//use mongoose to connect to MongoDB database
mongoose.connect(
  `mongodb+srv://testAdmin:${env_variable}@homehubserver.yi9s3vq.mongodb.net/homehubserver?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//get the default connection
const db = mongoose.connection;
let con = true

//event listeners for database connection status
db.on('error', (error) => {
    con = false
  console.error('MongoDB Connection Error:', error);
});

db.on('connected', () => {
  console.log('Connected to MongoDB!');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB!');
    con = false
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Connection Status: ${con}`)

});
