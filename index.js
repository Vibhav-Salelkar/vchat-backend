import express from "express";
import {chats} from "./data.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get('/', (req,res)=> {
    res.send('Hello from vchat')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('server started on port: ',PORT))