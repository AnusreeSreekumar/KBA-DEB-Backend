import { Router } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import {authenticate} from "../Middleware/auth.js";

dotenv.config();
const route = Router();
const secretKey = process.env.SecretKey;

//Define User Schema(is a design):
const userSchema = new mongoose.Schema({
    dbfirstName: String,
    dblastName: String,
    dbuserName: { type: String, unique: true },
    dbpassword: String,
    dbuserRole: String
})

//Define User Schema(is a design):
const courseSchema = new mongoose.Schema({
    dbcourseId:{type:String,unique:true},
    dbcourseName:String,
    dbcourseType:String,
    dbdescription:String,
    dbPrice:String
})

//Create Model
const User = mongoose.model('Userdetails', userSchema)

//Create Model
const Course = new mongoose.model('Coursedetails',courseSchema);

mongoose.connect('mongodb://localhost:27017/KBA_Courses')


route.get('/', (req, res) => {

    res.send("Hello World")
});

route.post('/signup', async (req, res) => {

    // try {

        const data = req.body;
        console.log("Input:" , data);
        
        const { FirstName,
            LastName,
            Username,
            Password,
            Role } = data;
        
        const newP = await bcrypt.hash(Password, 10);
        // console.log("hashed Password: ", newP);
        
        const existingUser = await User.findOne({ dbuserName: Username });
        // console.log(existingUser);
        
        if (existingUser) {
            console.log(`Username ${Username} is already present`);
            res.status(403).json({ message: "User exists" });
        }
        else {

            const newUser = new User({
                dbfirstName: FirstName,
                dblastName: LastName,
                dbuserName: Username,
                dbpassword: newP,
                dbuserRole: Role
            });
            await newUser.save();
            res.status(201).json({ message: "User registered" });
            // console.log(user.get(Username));
            console.log("User Registered successfully");
        }
    // }
    // catch (error) {
    //     res.status(500).json({ message: "Input field missing" });
    // }
})

route.post('/login', async (req, res) => {

    try {
        const { Username, Password } = req.body;
        const result = await User.findOne({dbuserName: Username});
        console.log(result);
    
        if (result) {
            
            const isvalid = await bcrypt.compare(Password, result.dbpassword)
            console.log(isvalid);
            if (isvalid) {
                const token = jwt.sign({ UserName: result.dbuserName, userRole: result.dbuserRole }, secretKey, { expiresIn: '1h' })
                console.log(token);
                res.cookie('authtoken', token, {
                    httpOnly: true
                });
                res.status(200).json({ message: "Success" })
            }
            else {
                res.status(103).json({ message: "Please check your credentials" })
            }
        }
        else {
    
            res.status(103).json({ message: "Please register" });
            console.log("User not present. Please register");
        }    
    } catch (error) {
        console.error(error);
        
    }  
})

route.post('/addCourse', authenticate, async (req, res) => {

    const loginName = req.UserName;
    const loginRole = req.UserRole;

    // const addcourses = new Map();

    console.log(loginRole);

    const {
        CourseName,
        CourseId,
        CourseType,
        Description,
        Price
    } = req.body;

    try {

        if (loginRole == 'admin') {

            const existingCourse = await Course.findOne({dbcourseId : CourseId});
            // console.log(existingCourse);

            if(existingCourse == null){                
                
                const newCourse = new Course({
                    dbcourseId : CourseId,
                    dbcourseName : CourseName,
                    dbcourseType : CourseType,
                    dbdescription : Description,
                    dbPrice : parseInt(Price) 
                });
                await newCourse.save();
                res.status(201).json({ message: "Course added" });
                console.log("Course added successfully");
            }
            else{

                res.status(400).json({message: "Course already present"});
            }
        }
        else {
            res.status(401).json({ message: "User role should be Admin" });

        }
    }
    catch (error) {

        res.status(500).json({ message: "No response from Client" })
    }
})

//getCourse using Post method

// route.post('/getCourse', authenticate, (req, res) => {

//     const loginName = req.UserName;

//     try {

//         if (loginName) {

//             const result = []
//             // const data = ;
//             const data = req.body;
//             const searchItem = data.Search;

//             if (searchItem) {
//                 for (const [id, item] of addcourses) {
//                     if (id.includes(searchItem) || item.CourseName.includes(searchItem) || item.CourseType.includes(searchItem)) {
//                         result.push(
//                             id,
//                             item.CourseName,
//                             item.CourseType,
//                             item.Description,
//                             item.Price
//                         );
//                     }
//                 }
//                 if (result.length > 0) {

//                     res.status(200).json({
//                         message: "Course details are:",
//                         courses: result
//                     });
//                     console.log("Course details published");

//                     // break;
//                 }
//                 else {

//                     res.status(404).json({ message: "Search not found" });
//                     console.log("Searched course not available");
//                 }
//             }
//             else {

//                 res.status(404).json({ message: "Course not available" });
//                 console.log("No such Course available");

//             }

//         }
//         else {

//             console.log("Please login");
//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: "Client server missing" });

//     }
// });

//getCourse using params in GET method

// route.get('/getCourse/:id', authenticate, (req, res) => {

//     const loginName = req.UserName;
//     try {
//         if (loginName) {

//             const searchItem = req.params.id;
//             const result = [];
//             if (searchItem) {
//                 if (addcourses.size > 0) {

//                     for (const [id, item] of addcourses) {
//                         if (id.includes(searchItem) || item.CourseName.includes(searchItem) || item.CourseType.includes(searchItem)) {
//                             result.push(
//                                 id,
//                                 item.CourseName,
//                                 item.CourseType,
//                                 item.Description,
//                                 item.Price
//                             );
//                         }
//                     }
//                 } else {

//                     console.log("Map is empty");

//                 }
//                 if (result.length > 0) {

//                     res.status(200).json({
//                         message: "Course details are:",
//                         courses: result
//                     });
//                     console.log("Course details published");
//                 }
//                 else {

//                     res.status(404).json({ message: "Searched Course not found" });
//                 }
//             }
//             else {

//                 console.log("No such Course available");

//             }
//         }
//         else {

//             console.log("Please login");
//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: "Client server missing" });

//     }
// });

// getCourse using query in GET method

route.get('/getCourse', async (req, res) => {

    try {

        const searchItem = req.query.CourseName;
        const result = [];
        if (searchItem) {
            const result = await Course.findOne({dbcourseName:searchItem})
            if(result){
                res.status(200).json(result)
                console.log("Course details published");
            }
            else {

                res.status(404).json({ message: "Searched Item is not matching" });
            }
        }
        else {

            res.status(404).json({ message: "No such course available" });

        }
    }
    catch (error) {

        res.status(500).json({ message: "Client server missing" });
    }

});

//updateCourse using POST request

// route.post('/updateCourse', authenticate, (req, res) => {

//     const loginRole = req.UserRole;

//     try {

//         if (loginRole == 'admin') {

//             const data = req.body;
//             const updateId = data.CourseId;
//             console.log("Inside first If", data);

//             if (addcourses.has(updateId)) {

//                 const mapitem = addcourses.get(updateId);
//                 // console.log("Inside 2nd If",mapitem);
//                 const {
//                     CourseId,
//                     newCourseName,
//                     newCourseType,
//                     newDescription,
//                     newPrice
//                 } = data;

//                 mapitem.CourseId = CourseId || mapitem.CourseId;
//                 mapitem.CourseName = newCourseName || mapitem.CourseName;
//                 mapitem.CourseType = newCourseType || mapitem.CourseType;
//                 mapitem.Description = newDescription || mapitem.Description;
//                 mapitem.Price = newPrice || mapitem.Price;
//                 addcourses.set(CourseId, mapitem);
//                 console.log("after update ", mapitem);
//             }
//         }
//     }
//     catch (error) {

//         res.status(500).json({ message: "Client server missing" });
//     }

// });

//updateCourse using PUT request

// route.put('/updateCourse/:id', authenticate, (req, res) => {

//     const loginRole = req.UserRole;

//     try {

//         if (loginRole == 'admin') {

//             const data = req.body;
//             const updateId = req.params.id;

//             if (addcourses.has(updateId)) {

//                 const mapitem = addcourses.get(updateId);
//                 const {
//                     newCourseName,
//                     newCourseType,
//                     newDescription,
//                     newPrice
//                 } = data;

//                 mapitem.CourseName = newCourseName;
//                 mapitem.CourseType = newCourseType;
//                 mapitem.Description = newDescription;
//                 mapitem.Price = newPrice;
//                 addcourses.set(updateId, mapitem);
//                 res.status(200).json({ message: "Course updated successfully" });
//                 console.log(addcourses);
//             }
//         }
//     }
//     catch (error) {

//         res.status(500).json({ message: "Client server missing" });
//     }

// });

// updateCourse using PATCH request

route.patch('/updateCourse', authenticate, async (req, res) => {

    const loginRole = req.UserRole;

    try {

        if (loginRole == 'admin') {

            const {
                CourseName,
                CourseId,
                CourseType,
                Description,
                Price
            } = req.body;

            // const updateId = req.params.id;
            // console.log("Inside first if ID: ",updateId);

            const dbdata = await Course.updateOne({dbcourseId:CourseId},
                { $set: {
                    dbcourseName : CourseName,
                    dbcourseType : CourseType,
                    dbdescription : Description,
                    dbPrice : Price
                }
            });
            if(dbdata.matchedCount == 0){
                return res.status(404).json({message:"No such Course"})
            }
            else{
                return res.status(200).json({message: "Course details updated"});
            }
        }
        res.status(404).json({message:"Please login as admin"})
    }
    catch (error) {

        res.status(500).json({ message: "Client server missing" });
    }
});

// route.delete('/deleteCourse/:id', authenticate, (req, res) => {

//     const loginRole = req.UserRole;
//     try {

//         if (loginRole == 'admin') {

//             const data = req.params.id;
//             // const updateId = 
//             if (addcourses.has(data)) {

//                 addcourses.delete(data);
//                 res.status(200).json({ message: "Course Deleted" });
//                 console.log("Course Deleted");
//             }
//             else {

//                 res.status(404).json({ message: "No Course Found" });
//             }
//         }
//         else {
//             console.log("Please login as Admin");

//         }
//     }
//     catch (error) {
//         res.status(500).json({ message: "Client Server missing" });
//     }
// });

export { route };
