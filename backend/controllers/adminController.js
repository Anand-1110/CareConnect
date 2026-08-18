import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"


//API for adding doctor
const addDoctor = async (req,res) => {
    try {

        console.log("ADD DOCTOR CONTROLLER REACHED")
        const { name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file

        console.log("BODY:", req.body)
        console.log("FILE:", req.file)

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        // validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }

        // validating strong password
        if(password.length < 8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        console.log("STARTING CLOUDINARY UPLOAD")
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url
        console.log("CLOUDINARY UPLOAD SUCCESS")

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }
        console.log("CREATING DOCTOR")
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        console.log("DOCTOR SAVED TO MONGODB")

        res.json({success:true,message:"Doctor Added"})

    }
    catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for Admin login
const loginAdmin = async (req,res) => {
    try {

        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        } else {
            res.json({success:false,message:"Invalid credentials"})
        }
 
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get all doctors list for admin panel
const allDoctors = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}



export {addDoctor,loginAdmin,allDoctors}