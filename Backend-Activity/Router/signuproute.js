import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../Middleware/auth.js";

const adminRoutes = Router();
const user = new Map();
const usercert = new Map();
const secretKey = 'hello';

adminRoutes.post('/signup', async (req, res) => {

    try {

        const {
            Fname,
            Lname,
            Email,
            Password,
            Role
        } = req.body;

        const encryptpass = await bcrypt.hash(Password, 10);

        if (user.has(Email)) {
            res.status(103).json({ message: "User exists in DB" });
            console.log("User present");
        }
        else {
            user.set(Email, { Fname, Lname, encryptpass, Role });
            res.status(200).json({ message: "User added to DB" });
            console.log(user);
        }
    }
    catch (error) {
        res.status(500).json();
    }
})

adminRoutes.post('/login', async (req, res) => {

    try {

        const {
            Email,
            Password
        } = req.body;

        const mapdata = user.get(Email);

        if (!mapdata) {

            res.status(103).json({ message: "User not registered" });
            console.log("Please register this user")
        }
        else {

            const isvalid = await bcrypt.compare(Password, mapdata.encryptpass)
            if (isvalid) {
                const token = jwt.sign({ username: Email, Userrole: mapdata.Role }, secretKey, { expiresIn: '1h' })
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

adminRoutes.post('/issuecertificate', authenticate, (req, res) => {

    // const loginName = req.UserName;
    // const loginRole = ;
    try {

        const data = req.body;

        const { CertificateId,
            Course,
            CertificateName,
            Grade,
            IssueDate } = data;

        console.log(CertificateId);
        console.log(req.UserRole);

        if (req.UserRole == 'admin') {

            if (usercert.has(CertificateId)) {
                console.log("Already Issued")
                res.status(200).json({ message: "Already Issued" })
            }
            else {
                usercert.set(CertificateId, { Course, CertificateName, Grade, IssueDate });
                console.log(usercert);
                res.status(201).json({ message: "New Certificate" })
            }
        }
    }
    catch (error) {
        console.log(error);
        ;
    }
})

adminRoutes.get('/viewcertificate/:id', (req, res) => {

    try {

        const certId = req.params.id;

        if (usercert.has(certId)) {

            const data = usercert.get(certId);
            const userdata = user.get()

            res.status(200).json({ message: 'Issued Certificate' })
            console.log("This is to certify that Anusree");
            console.log(`has successfully completed ${data.CertificateName}`);
            console.log(`with ${data.Grade} on ${data.IssueDate}`);
        }
        else {

            res.status(404).json({ message: 'Not generated' });
            console.log('Certificate not issued');
        }
    }
    catch (error) {
        console.log('Server Issue');
    }

})

export { adminRoutes };
