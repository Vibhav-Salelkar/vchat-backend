import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import userRoutes from './routes/userRoutes.js';
import chatsRoutes from './routes/chatsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { urlNotFound, errorHandler } from "./middleware/error.js";

const app = express();
dotenv.config();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

app.use('/user', userRoutes);
app.use('/chats', chatsRoutes);
app.use('/message', messageRoutes);
app.get('/', (req,res)=> {
    res.send('Hello from vchat')
})

app.use(urlNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      process.exit();
    }
};

connectDB();

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}`)
);

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection',(socket) => {
    console.log('connected to socket.io');

    socket.on('setup', (userData)=> {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room)=> {
        socket.join(room);
        console.log('User joined room '+room);
    });
  
    socket.on('new message',(newMessage) => {
        var chat = newMessage.chat;

        if(!chat.users) {
            return console.log('chat.users not defined');
        }

        chat.users.forEach(user=> {
            if(user._id == newMessage.sender._id){
                return
            }
            socket.in(user._id).emit('message received',newMessage);
        });

        socket.off('setup',()=> {
            console.log('User logged off');
            socket.leave(userData._id);
        })
    });

    socket.on('typing',(room)=>socket.in(room).emit('typing'));

    socket.on('stop typing', (room)=>socket.in(room).emit('stop typing'));
})