import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
const SecretKey = process.env.secretKey

const authenticate = (req, res, next) => {

    const cokkies = req.headers.cookie;
    const cookie = cokkies.split(';')
    for(let cooky of cookie){
        const[name, token] =  cooky.trim().split('=');
        if(name == 'authtoken'){
             const tokenverifcn =  jwt.verify(token, SecretKey)
             req.UserName = tokenverifcn.UserName;
             req.UserRole = tokenverifcn.UserRole;
            //  console.log("Role in token",tokenverifcn.userRole);
             
             break;
        }
     }
     next();
 }
 
 export {authenticate}