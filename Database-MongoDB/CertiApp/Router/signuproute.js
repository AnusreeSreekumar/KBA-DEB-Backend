import { Router } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { authenticate } from "../Middleware/auth.js";
import mongoose from "mongoose";

dotenv.config();
const adminRoutes = Router();
const AdminKey = process.env.Admin_SecretKey;
const secretKey = process.env.SecretKey;

//Define User schema:
const userSchema = new mongoose.Schema({
    dbFstName: String,
    dbLstName: String,
    dbEmail: { type: String, unique: true },
    dbPassword: String,
    dbRole: String
})

//Define Certificate Schema
const certSchema = new mongoose.Schema({
    dbCertId: { type: String, unique: true },
    dbCourse: String,
    dbCertName: String,
    dbGrade: String,
    dbDate: String
})

mongoose.connect('mongodb://localhost:27017/CertiApp')

const CertUser = mongoose.model('Userdetails', userSchema);
const IssuedCert = mongoose.model('Certificates', certSchema);

adminRoutes.post('/signup', async (req, res) => {

    try {

        const data = req.body;
        const {
            Fname,
            Lname,
            Email,
            Password
        } = data;
        // console.log(data);        

        const role = (req.body.secret == AdminKey) ? 'Admin' : 'User';
        const encryptpass = await bcrypt.hash(Password, 10);

        const existingEmail = await CertUser.findOne({ dbEmail: Email });
        if (existingEmail) {

            res.status(404).json({ message: "User exists in DB" });
            console.log("User present");
        }
        else {

            const newUser = new CertUser({
                dbFstName: Fname,
                dbLstName: Lname,
                dbEmail: Email,
                dbPassword: encryptpass,
                dbRole: role
            })
            await newUser.save();
            switch (role) {

                case 'Admin':
                    res.status(200).json({ message: "Admin added to DB" });
                    break;
                case 'User':
                    res.status(200).json({ message: "User added to DB" });
                    break;
            }
            console.log(newUser);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
})

adminRoutes.post('/login', async (req, res) => {

    try {

        const {
            Email,
            Password
        } = req.body;

        const existingUser = await CertUser.findOne({ dbEmail: Email });
        // console.log(existingUser);

        if (!existingUser) {

            res.status(404).json({ message: "User not registered" });
            console.log("Please register this user")
        }
        else {

            const isvalid = await bcrypt.compare(Password, existingUser.dbPassword)
            console.log(isvalid);
            if (isvalid) {
                const token = jwt.sign({ Username: existingUser.dbEmail, Userrole: existingUser.dbRole }, secretKey, { expiresIn: '1h' })
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
    }
    catch (error) {
        res.status(500).json();
    }
})

adminRoutes.post('/issuecertificate', authenticate, async (req, res) => {

    // const loginName = req.UserName;
    const loginRole = req.UserRole;
    try {

        if (loginRole == 'Admin') {

            const data = req.body;

            const { CertId,
                Course,
                CertName,
                Grade,
                IssueDate } = data;

            const existingCerty = await IssuedCert.findOne({ dbCertId: CertId })

            if (existingCerty) {
                console.log("Already Issued")
                res.status(200).json({ message: "Already Issued" })
            }
            else {

                const newCert = new IssuedCert({
                    dbCertId: CertId,
                    dbCourse: Course,
                    dbCertName: CertName,
                    dbGrade: Grade,
                    dbDate: IssueDate
                })
                await newCert.save();
                console.log(newCert);
                res.status(201).json({ message: "New Certificate added" })
            }
        }
    }
    catch (error) {
        console.log(error);
    }
})

adminRoutes.get('/viewcertificate/:id', authenticate, async (req, res) => {

    const loginName = req.UserName;
    try {

        if (loginName) {

            const certId = req.params.id;

            const existingCerty = await IssuedCert.findOne({dbCertId : certId});
            const username = await CertUser.findOne({dbEmail : loginName});

            if (existingCerty) {

                res.status(200);
                res.json({message: existingCerty})

                console.log(`This is to certify that ${username.dbFstName} ${username.dbLstName}`);
                console.log(`has successfully completed ${existingCerty.dbCertName}`);
                console.log(`with ${existingCerty.dbGrade} on ${existingCerty.dbDate}`);
            }
            else {

                res.status(404).json({ message: 'Not generated' });
                console.log('Certificate not issued');
            }
        }
    }
    catch (error) {
            console.log('Server Issue');
        }

    })

export { adminRoutes };
