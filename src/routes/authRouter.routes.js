const express = require("express");
const authRouter= express.Router();
const UserModel = require("../models/user.model");
const {validateSignUp} = require('../utils/validators.utils')
const bcrypt= require("bcrypt");


authRouter.post("/signup",async(req,res)=>{    
    try{
        // validation of the data:
        validateSignUp(req)
        
        const {firstName , lastName, gender , email, password}=req.body;
         
        //Encrypt the password: // salting karni 
        const passwordHash= await bcrypt.hash(password,10);
        // console.log(password);
        

        const user=new UserModel({  // instance of UserModel 
            firstName,
            lastName,
            email,
            gender,
            password:passwordHash,
        })

    await user.save();
    res.send("Data saved sucessfully")

}catch(err){
    res.status(400).send("ERROR:"+ err.message)
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

    if(isPasswordValid){
        const token= await user.getJWTtoken();  
        res.cookie("token",token);
        res.send("Login sucessfull!!")
    }
    else{
        throw new Error("Invalid credentials!!")
    }
}
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    }
    )
    res.send("logOut sucessfull!!")
})

module.exports=authRouter