import { Router } from "express";
import { authenticate } from "../Middileware/userMiddileware.js";
import mongoose from "mongoose";
const issueCertificate=Router();

const courseSchema = new mongoose.Schema({
    Course:String,
    Cname: String,
    CertificateId:{
        type:String,
        unique:true

    },
    CertificateName:String,
    Grade:String,
    Date:String
})

const CourseModel = mongoose.model("courseDetails",courseSchema);

issueCertificate.post('/addCerificate',authenticate,async(req,res)=>{
    
    const {Course,Cname,CertificateId,CertificateName,Grade,Date}=req.body

    const existingCourseId= await CourseModel.findOne({CertificateId:CertificateId})
    try {
        if(req.UserRole == "admin"){
            // console.log( req.UserRole);

            if(existingCourseId){
                res.status(400).json({message:"Certficate ID Already Exist"})
    
            }else{

                const newCourse= new CourseModel({
                    Course:Course,
                    Cname:Cname,
                    CertificateId:CertificateId,
                    CertificateName:CertificateName,
                    Grade:Grade,
                    Date:Date
                })
                await newCourse.save()
                res.status(201).json({message:"Admin Course Added",newCourse})
                
            }
        }else{
            res.status(401).json({message:"Unauthorized:User not an admin"})
        }

       
        
    } catch (error) {
         res.status(500).json(error)
    }
})

issueCertificate.get('/getCertificate/:id',async(req,res)=>{

    const CertificateId= req.params.id
   const existingCertificate = await CourseModel.findOne({CertificateId:CertificateId})
    try {
        if(existingCertificate){

            return res.status(200).json({
                message: "Certificate found",
                course: existingCertificate, 
            });
   
        }else {
            return res.status(404).json({ message: "Certificate not found" });
        }
    } catch (error) {
        res.status(500).json(error)
    }


})

//getall courses

issueCertificate.get('/getCertificate',authenticate,async(req,res)=>{

    const getAllCertificate = await CourseModel.find()
    try {
        if(req.UserRole=="admin"){
            if(getAllCertificate){

                return res.status(200).json({
                    message: "Certificates found",
                    course: getAllCertificate, 
                });
       
            }else {
                return res.status(404).json({ message: "Certificate not Added" });
            }
        }
  
    } catch (error) {
        res.status(500).json(error)
    }


})
export {issueCertificate}