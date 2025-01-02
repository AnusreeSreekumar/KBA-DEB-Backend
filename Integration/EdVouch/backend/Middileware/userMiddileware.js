import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secretKey =process.env.secretKey;

const authenticate=(req,res,next)=>{
   const cookies= req.headers.cookie;

   const cookie=cookies.split(';')

   for(let cooki of cookie){ 

    const [name,token]= cooki.trim().split('=')
    if(name=="authCertitoken"){
    const verified=  jwt.verify(token,secretKey)
      console.log(verified);
      console.log(verified.username);

      req.Username=verified.username
      req.UserRole=verified.role;
      
      
      break;
    }
   }
   
   console.log(cookies);
   next();
   
}

export{authenticate}