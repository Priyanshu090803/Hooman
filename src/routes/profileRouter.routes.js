const express = require("express");
const profileRouter= express.Router();
const {userAuth} = require("../Middleware/auth.middleware")
const {validateEditProfileData}=require('../utils/validators.utils');
const userModel = require("../models/user.model");

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
      const user= req.user;
      res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try{
    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request");
    }
  const loggedInUser = req.user;
  Object.keys(req.body).forEach(keys=> loggedInUser[keys]=req.body[keys])  // editing logic
                                                              // object.key se (key) milegi req.body se jo bhi data ara hoga eg:firstaname,age etc
                                                            // then wo mai foreach lgake loop krre and jo bhi loggedIn user hai uske data mai
                                                            // then loggedIn user k key k andr req.body mai edited cheez dal denge
  await loggedInUser.save();
  
  res.json({
    message: `${loggedInUser.firstName}, your profile updated sucessfully`,
    data : loggedInUser
  });
}
  catch(err){
    res.status(400).send("ERROR:",err.message)
  }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{

  try{ 
    const user = await userModel.findById(req.user._id)
    const{oldPassword,newPassword,confirmPassword} = req.body;
    const isCorrectPassword = user.validatePassword(oldPassword)
    if(!isCorrectPassword){
      throw new Error("Password is wrong!")
    }
    if(newPassword!==confirmPassword){
      throw new Error("Your password din't mathch with confirm password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    res.status(200).
    json({
      message:"Your password changed sucessfully!"
    })
  }
  catch(err){
    res.status(400).send("ERROR:"+err.message)
  }
})


module.exports= profileRouter;