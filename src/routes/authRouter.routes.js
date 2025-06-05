const express = require("express");
const authRouter= express.Router();
const UserModel = require("../models/user.model");
const {validateSignUp} = require('../utils/validators.utils')
const bcrypt= require("bcrypt");
const { userAuth } = require("../Middleware/auth.middleware");
const validator = require("validator")
const {upload} = require("../Middleware/multer.middleware.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.service");

authRouter.post("/signup",upload.single("photoUrl"),async(req,res)=>{    
    try{
        // validation of the data:
        validateSignUp(req)
        
        const {firstName , lastName, gender , email, password}=req.body;
         const existingUser = await UserModel.findOne({email})
         if(existingUser){
            throw new Error("User already exists")
         }
        //Encrypt the password: // salting karni 
        const passwordHash= await bcrypt.hash(password,10);
        // console.log(password);
           const localFilePath = req.file.path;
           if(!localFilePath){
            throw new Error("Can't find localPath")
           }
           const photoUrl = await uploadOnCloudinary(localFilePath)

        const user=new UserModel({  // instance of UserModel 
            firstName,
            lastName,
            email,
            gender,
            photoUrl:photoUrl.url||"",
            password:passwordHash,
        })

    await user.save();
    res.send("Data saved sucessfully")

}catch(err){
    return res.status(400).send("ERROR:"+ err.message)
}
   
})



authRouter.post("/login",async(req,res)=>{
    try{
    const {email,password}=req.body;
    if(!validator.isEmail(email)){
       throw new Error ("Please enter valid email")
    }
    const user = await UserModel.findOne({email:email})

    if(!user){
        throw new Error("Invalid credentials!!")
    }
    const isPasswordValid = await user.validatePassword(password)
    const loggedInUser = await UserModel.findById(user._id).select(" -password ")

    if(isPasswordValid){
        const token= await user.getJWTtoken();  
        res.cookie("token",token);
        res.send(loggedInUser)
    }
    else{
        throw new Error("Invalid credentials!!")
    }
    
}
    catch(err){
       return res.status(400).send("ERROR:"+err.message)
    }
})


authRouter.post("/logout",userAuth,async(req,res)=>{
    await UserModel.findByIdAndUpdate(
        req.user._id,       // added by me
    { 
        $unset:{
            token:1
        },
    },
    {
        new:true
    }
)
    res.cookie("token",null,{
        expires: new Date(Date.now())
    }
    )
    res.send("logOut sucessfull!!")
})

module.exports=authRouter