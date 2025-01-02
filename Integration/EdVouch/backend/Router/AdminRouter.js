import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const AdminRoute =Router()
const secretKey = "akhil"

// const admin = new Map()

const userSchema = new mongoose.Schema({
    username:String,
    email:{
    type:String,
    unique:true
    },
    password:String,
    role:String
})

const User = mongoose.model("userDetails",userSchema);


mongoose.connect('mongodb://localhost:27017/CertiApp')
//signup
AdminRoute.post('/signup',async(req,res)=>{
    const {username,email,password,role} =req.body

    const existingUser= await User.findOne({email:email})

    try {
         
    if(existingUser){
        res.status(400).json({message:"email already exist"})
    }else{

    const newP= await bcrypt.hash(password,10)
    const newUser= new User({
        username:username,
        email:email,
        password:newP,
        role:role
    }) 
    await newUser.save();

    res.status(201).json({message:"Register Successfully"},
     
    )

    }

    } catch (error) {
        res.status(500).json(error)
    }

})

//login

AdminRoute.post('/login',async(req,res)=>{
    const {email,password} =req.body

   const result = await User.findOne({email:email})
    // console.log(result);
    if(!result){
        res.status(400).json({message:"login failed,Inavlid email"})
    }else{
        const isvalid = await bcrypt.compare(password,result.password)
        console.log(isvalid);
        if(isvalid){
            const token =jwt.sign({username:result.username,role:result.role},secretKey,{expiresIn:'1h'})
            console.log(token);
            res.cookie("authCertitoken",token,{
                httpOnly:true
            });
            console.log(token);
            return res.status(200).json({ message: "Login successful" });
            
        }else{
            res.status(400).json({message:"password is incorrect"})
        }
        
    }
    

})




export {AdminRoute}




