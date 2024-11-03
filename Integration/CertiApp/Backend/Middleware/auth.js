import jwt from 'jsonwebtoken';

const secretKey = 'hello';

const authenticate = (req,res,next) => {

    const cookies = req.headers.cookie;
    // req.cookies
    // console.log(cookies);
    const cookie = cookies.split(';');
    for(let cooky of cookie){
       const[name, token] =  cooky.trim().split('=');
       if(name == 'authtoken'){
            const tokenverifcn =  jwt.verify(token, secretKey)
            // console.log(tokenverifcn);
            req.UserName = tokenverifcn.Username;
            req.UserRole = tokenverifcn.Userrole;
            // console.log("Username:",tokenverifcn.username);
            // console.log("Role:",tokenverifcn.Userrole);
            break;
       }
    }
    next();
}

export {authenticate}