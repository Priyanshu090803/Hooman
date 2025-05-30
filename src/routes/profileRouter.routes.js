const express = require("express");
const profileRouter= express.Router();
const userAuth = require("../Middleware/auth.middleware")
const {validateEditProfileData}=require('../utils/validators.utils')

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
      const user= req.user;
      res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

profileRouter.patch("profile/edit",userAuth,async(req,res)=>{
  try{
    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request");
    }
  const loggedInUser = req.user;
  Object.keys(req.body).forEach(keys=> loggedInUser[keys]=req.body[keys])
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



module.exports= profileRouter;