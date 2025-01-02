import express,{json} from 'express';
import { issueCertificate } from './Router/userRouter.js';
import { AdminRoute } from './Router/AdminRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app= express()

app.use(cors({
    origin:"http://127.0.0.1:5500",
    credentials:true
 }))
 app.use(json())
 app.use(cookieParser())

 app.use('/',AdminRoute)

app.use('/',issueCertificate)
 const port=process.env.port

app.listen(port,(req,res)=>{
    console.log("server running on port",port);
    
})

