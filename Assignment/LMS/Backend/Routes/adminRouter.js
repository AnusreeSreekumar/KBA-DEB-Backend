import { Router } from "express";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { authenticate } from "../Middleware/auth.js";
import { User } from "../Models/User";
import { Books } from "../Models/Book.js";
// import multer from 'multer';
// impo GridFsStorage } from 'multer-gridfs-storage';
// import { GridFSBucket } from "mongodb";rt {

dotenv.config();
const adminRouter = Router();
const SecretKey = process.env.secretKey;
const mongoURI = process.env.mongohost;

mongoose.connect(mongoURI)
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

adminRouter.post('/signup', async (req, res) => {

    try {
        const data = req.body;
        const { Name,
            Username,
            Email,
            Password,
            Genre,
            Language
        } = data;

        console.log("Entered data: ", data);

        const encryptpass = await bcrypt.hash(Password, 10);
        const Role = 'User'
        console.log("UserRole: ", Role);

        const existingEmail = await User.findOne({ dbEmail: Email })
        console.log("Existing email: ", existingEmail);

        if (existingEmail == null) {

            const newUser = new User({
                dbName: Name,
                dbUsername: Username,
                dbEmail: Email,
                dbPassword: encryptpass,
                dbGenre: Genre,
                dbLanguage: Language,
                dbRole: Role
            })
            try {
                await newUser.save();
                console.log("User saved successfully!");
                res.status(201).json({ message: "Successfully registered" })
            } catch (error) {
                console.error("Error saving user:", error);
            }
            await newUser.save();
            console.log("User registered successfully");

        }
        else {

            console.log("User already registered")
            res.status(103).json({ message: "Already registered" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Client error" })
    }
})

adminRouter.post('/login', async (req, res) => {

    try {

        const {
            Email,
            Password
        } = req.body;

        console.log("Entered Email: ", Email);


        // const encryptpass = await bcrypt.hash(Password, 10)
        const existingEmail = await User.findOne({ dbEmail: Email })
        console.log("Existing Email: ", existingEmail);

        if (existingEmail) {

            const isvalid = await bcrypt.compare(Password, existingEmail.dbPassword);
            if (isvalid) {
                const token = jwt.sign({ UserName: existingEmail.dbUsername, UserRole: existingEmail.dbRole }, SecretKey, { expiresIn: '1h' })
                console.log(token);
                res.cookie('authtoken', token, { httpOnly: true })
                res.status(200).json({ message: "Success" })
                console.log('User logged In');
            }
            else {
                console.log('Please login');
            }
        }
        else {
            console.log('Please register');
        }
    }
    catch (error) {
        console.log(error);
    }
})

adminRouter.post('/addbook', authenticate, async (req, res) => {

    const loginRole = req.UserRole
    console.log(loginRole);

    try {

        if (loginRole == 'Admin') {

            const {
                BookName,
                Author,
                Description,
                Genre,
                Language,
            } = req.body;

            // console.log(CoverImage);
            

            const newBook = new Books({
                dbBookName: BookName,
                dbAuthorName: Author,
                dbDescription: Description,
                dbGenre: Genre,
                dbLanguage: Language,
            });
            await newBook.save();
            res.status(201).json({ message: "New Book added entry created" })
            console.log("New Book entry created");
        }
        else {
            res.status(404).json({ message: "Login as Admin" })
            console.log('Admin can only Add Books');
        }
    }
    catch (Error) {
        console.log(Error);
    }
})

adminRouter.get('/viewUser', authenticate, async (req, res) => {

    try {

        const user = req.UserRole;
        res.json({ user })
    }
    catch (error) {
        res.status(404).json({ message: 'user not authorized' });
    }
})

adminRouter.get('/getBook', async (req, res) => {

    try {

        const searchItem = req.query.BookName;
        console.log(searchItem);

        const existingBook = await Books.findOne({ dbBookName: searchItem })
        console.log(existingBook);

        if (existingBook) {

            console.log("Response Data:", existingBook);
            res.status(200).json(existingBook);
        }
        else {

            res.status(404).json({ message: 'Not generated' });
            console.log('Book not added');
        }
    }
    catch (error) {
        console.log(error);
    }
})

adminRouter.get('/viewBooks', async (req, res) => {

    try {

        const result = await Books.find();
        if (result) {

            res.status(200).json({ result });
            console.log("Books in the library are fetched");

        }
        else {
            res.json("No data")
            console.log("No Books in DB");
        }
    }
    catch (error) {
        console.log(error);
    }
})

adminRouter.patch('/updateBook', authenticate, async (req, res) => {

    const loginRole = req.UserRole
    try {

        if (loginRole == 'Admin') {

            const data = req.body;
            const {
                BookName,
                Author,
                Description,
                Genre,
                Language
            } = data

            console.log("Input data: ",data);

            const book = await Books.findOne({ dbBookName: BookName });
            console.log("DB data: ",book);
            
            const dbdata = await Books.updateOne({ dbBookName: BookName },
                {
                    $set: {

                        dbBookName: BookName,
                        dbAuthorName: Author,
                        dbDescription: book.dbDescription + Description,
                        dbGenre: Genre,
                        dbLanguage: Language
                    }
                });
            if (dbdata.matchedCount == 0) {
                return res.status(404).json({ message: "No entry for Book" })
            }
            else {
                res.status(200).json({ dbdata });
                console.log("Book details updated");
                return null;
            }
        }
        else{

            console.log("Admin access only");
            
        }
    }
    catch (error) {
        console.log(error);
    }

})

adminRouter.delete('/deleteBook/:bookName', authenticate, async (req, res) => {

    const loginRole = req.UserRole;
    try{

        if(loginRole == 'Admin'){

            const BookName = req.params.bookName;
            const existingBook = await Books.findOne({dbBookName : BookName});
            console.log("Existing: ", existingBook);
            
            if(existingBook){

                await Books.deleteOne({dbBookName : BookName})
                res.status(200).json({ message: "   Book Entry Deleted" });
                console.log("Course Deleted");
            }
            else {

                res.status(404).json({ message: "No Book Found" });
            }
        }
        else {
            console.log("Please login as Admin");

        }
    }
    catch(error){
        console.log(error);
    }
})

export { adminRouter };