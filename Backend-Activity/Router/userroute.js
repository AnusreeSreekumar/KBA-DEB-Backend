import { Router } from 'express';

const userroute = Router();
const usercert = new Map();

userroute.post('/frontpage', (req, resp) => {

    try{

        const {
            CertificateId
        } = req.body;

        if(usercert.has(CertificateId)){

            resp.status(200).json({meesage : "Certificate already issued"});
            console.log("Certificate already issued");
        }
        else{

            resp.status(103).json({message : "New Certificate ID"});
            console.log("New Certificate requested");
        }
    }
    catch(error){
        res.status(500).json();
    }
})

userroute.post('/viewcertifictae', (req,res) => {

    const {
            UserName,
            CourseName,
            Academy,
            IssueDate
    } = req.body;

    const mapdata = usercert.get(CertificateId);
    
})

export { userroute };