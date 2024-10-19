import { Router } from 'express';

const userroute = Router();

const usercert = new Map();

userroute.post('/issuecertificate', (req, res) => {

    try {

    const data = req.body;

        const { CertificateId,
            Course,
            CertificateName,
            Grade,
            IssueDate } = data;

        console.log(CertificateId)

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
    catch (error){
        res.status(500).json();
    }
})

export { userroute };