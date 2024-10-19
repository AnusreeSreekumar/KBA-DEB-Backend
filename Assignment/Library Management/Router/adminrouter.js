import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const adminRouter = Router();
const adminMap = new Map();

adminRouter.post('/signup', async(req, res) => {

    try {

        const { Fname,
            Lname,
            Email,
            Password,
            Gender,
            Interest,
            Language
        } = req.body;

        const encryptpass = await bcrypt.hash(Password,10);

        if(adminMap.has(Email)){

            console.log("User already registered")
            res.status(103).json({message : "Already registered"});
        }
        else{

            adminMap.set(Email, {Fname, Lname, encryptpass, Gender, Interest, Language});
            console.log("User registered successfully");
            res.status(200).json({message : "Successfully registered"})
        }
    }
    catch(error){
        res.status(500).json({message : "Client error"})
    }
})

export { adminRouter };