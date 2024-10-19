import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; //this module is used for generating tokens

const route = Router();
const user = new Map(); 
const secretKey = 'hello';

route.get('/', (req, res) => {

    res.send("Hello World")
});

route.post('/signup', async (req, res) => {

    try {

        const data = req.body;

        const { FirstName,
            LastName,
            Username,
            Password,
            Role } = data;

        const newP = await bcrypt.hash(Password, 10);

        if (user.has(Username)) {
            console.log(`Username ${Username} is already present`);
            res.status(403).json({ message: "User exists" });
        }
        else {

            user.set(Username, { FirstName, LastName, newP, Role });
            res.status(201).json({ message: "User registered" });
            console.log(user.get(Username));
            console.log("User Registered successfully");
        }
    }
    catch (error) {
        res.status(500).json({ message: "Input field missing" });
    }
})

route.post('/login',async(req, res) => {

    const {Username, Password} = req.body;
    
    //  console.log(Username);
    
    const input = user.get(Username);
    // console.log(input);

    if(user.has(Username)){

        // res.status(200).json({message : "User present"})
        const isvalid = await bcrypt.compare(Password,input.newP)
        // console.log(isvalid);
        if(isvalid){
            const token =  jwt.sign({username : Username, UserRole : input.Role},secretKey,{expiresIn : '1h'})
            console.log(token);
            res.cookie('authtoken', token, {
                httpOnly : true
            });
            res.status(200).json({message : "Success"})
            
            // res.status(200).json({message : "User credentials are valid"})
        }
        else{
            res.status(103).json({message : "Please check your credentials"})
        }
    }
    else{

        res.status(103).json({ message: "Please register" });
        console.log("User not present. Please register");
    }

})

export { route };
