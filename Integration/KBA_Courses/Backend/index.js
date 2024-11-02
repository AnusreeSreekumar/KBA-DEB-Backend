import express, { json } from 'express';

import { route } from './Routes/adminRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express(); //creating an instance of imported 'express'

app.use(cors({
    origin:'http://127.0.0.1:5500',
    credentials:true
}));

app.use(json()) //we call inbuilt functions using express instance(app).use
app.use('/',route)

const port = process.env.port;

app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`)
})