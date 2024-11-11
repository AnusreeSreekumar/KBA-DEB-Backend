import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; //this module is used for generating tokens
import { authenticate } from "../Middleware/auth.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const route = Router();
const secretKey = process.env.SecretKey;

route.get('/', (req, res) => {

    res.send("Hello World")
})

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

route.post('/login', async (req, res) => {

    const { Username, Password } = req.body;

    const input = user.get(Username);

    if (user.has(Username)) {

        // res.status(200).json({message : "User present"})
        const isvalid = await bcrypt.compare(Password, input.newP)
        // console.log(isvalid);
        if (isvalid) {
            const token = jwt.sign({ userName: Username, userRole: input.Role }, secretKey, { expiresIn: '1h' })
            console.log(token);
            res.cookie('authtoken', token, {
                httpOnly: true
            });
            res.status(200).json({ message: "Success" })
            console.log("Login Successfull");
            // res.status(200).json({message : "User credentials are valid"})
        }
        else {
            res.status(103).json({ message: "Please check your credentials" })
        }
    }
    else {

        res.status(103).json({ message: "Please register" });
        console.log("User not present. Please register");
    }

})

route.post('/addCourse', authenticate, (req, res) => {

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

        // const CourseName = CourseName.trim().toLowerCase()

        if (loginRole == 'admin') {
            if (addcourses.has(CourseId)) {
                
                res.status(404).json({ message: "Existing Course" });
                console.log('Course already Present');

            }
            else {

                addcourses.set(CourseId, { CourseName, CourseType, Description, Price })
                res.status(201).json({ message: "Course added" });
                console.log(addcourses);
                console.log("Course added successfully");
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

route.post('/getCourse', authenticate, (req, res) => {

    const loginName = req.UserName;

    try {

        if (loginName) {

            const result = []
            // const data = ;
            const data = req.body;
            const searchItem = data.Search;

            if (searchItem) {
                for (const [id, item] of addcourses) {
                    if (id.includes(searchItem) || item.CourseName.includes(searchItem) || item.CourseType.includes(searchItem)) {
                        result.push(
                            id,
                            item.CourseName,
                            item.CourseType,
                            item.Description,
                            item.Price
                        );
                    }
                }
                if (result.length > 0) {

                    res.status(200).json({
                        message: "Course details are:",
                        courses: result
                    });
                    console.log("Course details published");

                    // break;
                }
                else {

                    res.status(404).json({ message: "Search not found" });
                    console.log("Searched course not available");
                }
            }
            else {

                res.status(404).json({ message: "Course not available" });
                console.log("No such Course available");

            }

        }
        else {

            console.log("Please login");
        }
    }
    catch (error) {
        res.status(500).json({ message: "Client server missing" });

    }
});

//getCourse using params in GET method

route.get('/getCourse/:id', authenticate, (req, res) => {

    const loginName = req.UserName;
    try {
        if (loginName) {

            const searchItem = req.params.id;
            const result = [];
            if (searchItem) {
                if (addcourses.size > 0) {

                    for (const [id, item] of addcourses) {
                        if (id.includes(searchItem) || item.CourseName.includes(searchItem) || item.CourseType.includes(searchItem)) {
                            result.push(
                                id,
                                item.CourseName,
                                item.CourseType,
                                item.Description,
                                item.Price
                            );
                        }
                    }
                } else {

                    console.log("Map is empty");

                }
                if (result.length > 0) {

                    res.status(200).json({
                        message: "Course details are:",
                        courses: result
                    });
                    console.log("Course details published");
                }
                else {

                    res.status(404).json({ message: "Searched Course not found" });
                }
            }
            else {

                console.log("No such Course available");

            }
        }
        else {

            console.log("Please login");
        }
    }
    catch (error) {
        res.status(500).json({ message: "Client server missing" });

    }
});

//getCourse using query in GET method

route.get('/getCourse', (req, res) => {

    try {

        const searchItem = req.query.CourseName;
        const result = [];
        if (searchItem) {
            if (addcourses.size > 0) {

                for (const [id, item] of addcourses) {
                    if (id.includes(searchItem) || item.CourseName.includes(searchItem) || item.CourseType.includes(searchItem)) {
                        result.push(
                            id,
                            item.CourseName,
                            item.CourseType,
                            item.Description,
                            item.Price
                        );
                    }
                }
            }
            else {

                console.log("Map is empty");

            }
            if (result.length > 0) {

                res.status(200).json({
                    message: "Course details are:",
                    courses: result
                });
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

route.post('/updateCourse', authenticate, (req, res) => {

    const loginRole = req.UserRole;

    try {

        if (loginRole == 'admin') {

            const data = req.body;
            const updateId = data.CourseId;
            console.log("Inside first If", data);

            if (addcourses.has(updateId)) {

                const mapitem = addcourses.get(updateId);
                // console.log("Inside 2nd If",mapitem);
                const {
                    CourseId,
                    newCourseName,
                    newCourseType,
                    newDescription,
                    newPrice
                } = data;

                mapitem.CourseId = CourseId || mapitem.CourseId;
                mapitem.CourseName = newCourseName || mapitem.CourseName;
                mapitem.CourseType = newCourseType || mapitem.CourseType;
                mapitem.Description = newDescription || mapitem.Description;
                mapitem.Price = newPrice || mapitem.Price;
                addcourses.set(CourseId, mapitem);
                console.log("after update ", mapitem);
            }
        }
    }
    catch (error) {

        res.status(500).json({ message: "Client server missing" });
    }

});

//updateCourse using PUT request

route.put('/updateCourse/:id', authenticate, (req, res) => {

    const loginRole = req.UserRole;

    try {

        if (loginRole == 'admin') {

            const data = req.body;
            const updateId = req.params.id;

            if (addcourses.has(updateId)) {

                const mapitem = addcourses.get(updateId);
                const {
                    newCourseName,
                    newCourseType,
                    newDescription,
                    newPrice
                } = data;

                mapitem.CourseName = newCourseName;
                mapitem.CourseType = newCourseType;
                mapitem.Description = newDescription;
                mapitem.Price = newPrice;
                addcourses.set(updateId, mapitem);
                res.status(200).json({ message: "Course updated successfully" });
                console.log(addcourses);
            }
        }
    }
    catch (error) {

        res.status(500).json({ message: "Client server missing" });
    }

});

//updateCourse using PATCH request

route.patch('/updateCourse/:id', authenticate, (req, res) => {

    const loginRole = req.UserRole;
    console.log(loginRole);
    

    try {

        if (loginRole == 'admin') {

            const data = req.body;
            const updateId = req.params.id;

            if (addcourses.has(updateId)) {

                const mapitem = addcourses.get(updateId);
                const {
                    newCourseName,
                    newCourseType,
                    newDescription,
                    newPrice
                } = data;

                mapitem.CourseName = newCourseName || mapitem.CourseName;
                mapitem.CourseType = newCourseType || mapitem.CourseType;
                mapitem.Description = newDescription || mapitem.Description;
                mapitem.Price = newPrice || mapitem.Price;
                addcourses.set(updateId, mapitem);
                res.status(200).json({ message: "Course updated successfully" });
                console.log(addcourses);
            }
            else {

            }
        }
    }
    catch (error) {

        res.status(500).json({ message: "Client server missing" });
    }
});

route.delete('/deleteCourse/:id', authenticate, (req, res) => {

    const loginRole = req.UserRole;
    try {

        if (loginRole == 'admin') {

            const data = req.params.id;
            // const updateId = 
            if (addcourses.has(data)) {

                addcourses.delete(data);
                res.status(200).json({ message: "Course Deleted" });
                console.log("Course Deleted");
            }
            else {

                res.status(404).json({ message: "No Course Found" });
            }
        }
        else {
            console.log("Please login as Admin");

        }
    }
    catch (error) {
        res.status(500).json({ message: "Client Server missing" });
    }
});

route.get('/viewUser', authenticate, (req, res) => {
    try {
        const user = req.UserRole;
        res.json({ user });
    }
    catch {
        res.status(404).json({ message: 'user not authorized' });
    }
});

route.get('/viewCourse', async (req, res) => {
    try {
        console.log(addcourses.size);

        if (addcourses.size != 0) {


            res.send(Array.from(addcourses.entries()))
        }
        else {
            res.status(404).json({ message: 'Not Found' });
        }
    }
    catch {
        res.status(404).json({ message: "Internal error" })
    }
});

route.get('/logout', (req, res) => {

    res.clearCookie('authtoken');
    res.status(200).json({ message: 'Logged Out' });
    console.log('Logout successfully');
})


export { route };
