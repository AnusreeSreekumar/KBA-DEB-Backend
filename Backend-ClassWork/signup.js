import express, { json } from 'express';
import bcrypt from 'bcrypt';

const app = express(); //creating an instance of imported 'express'
app.use(json()) //we call inbuilt functions using express instance(app).use
const user = new Map(); //to store the data passed in the request.

const port = 8000;

app.get('/', (req, res) => {

    res.send("Hello World")
});

app.post('/signup', async (req, res) => {

    try {

        console.log("Hi");
        const data = req.body;
        const fname = data.FirstName;
        const lname = data.LastName;
        const username = data.Username;
        const role = data.Role;

        const { FirstName,
            LastName,
            Username,
            Password,
            Role } = data;

        const newP = await bcrypt.hash(Password, 10); //to encrypt the password we have given

        if (user.has(username)) {
            console.log(`Username ${Username} is already present`);
            res.status(403).json({ message: "User exists" });
        }
        else {
            user.set(Username, { FirstName, LastName, newP, Role });
            console.log("User Registered successfully");
        }
    }
    catch(error){
        res.status(500).json({ message: "Input field missing" });
    }
})

app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`)
})