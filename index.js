import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from './routes/userRoutes.js';
import { urlNotFound, errorHandler } from "./middleware/error.js";

const app = express();
dotenv.config();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

app.use('/user', userRoutes);
app.get('/', (req,res)=> {
    res.send('Hello from vchat')
})

app.use(urlNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log("server running on port: ", PORT)))
    .catch((error) => console.log(error.message) )
