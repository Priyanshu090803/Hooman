const express = require("express");
const profileRouter= express.Router();
const {userAuth} = require("../Middleware/auth.middleware")
const {validateEditProfileData}=require('../utils/validators.utils');
const userModel = require("../models/user.model");
const { upload } = require("../Middleware/multer.middleware");

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
      const user= req.user;
      res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})
profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photoUrl"), // Add multer middleware
  async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid edit request");
      }

      const loggedInUser = req.user;

      // Handle photo upload if new photo is provided
      if (req.file) {
        const localFilePath = req.file.path;
        
        try {
          // Upload new photo to Cloudinary
          const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
          
          // Delete old photo from Cloudinary if exists
          if (loggedInUser.photoUrl) {
            const publicId = loggedInUser.photoUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          }
          
          // Update with new photo URL
          loggedInUser.photoUrl = cloudinaryResponse.secure_url;
        } catch (uploadError) {
          throw new Error("Failed to update profile photo");
        }
      }

      // Update other fields
      Object.keys(req.body).forEach(key => {
        if (key !== "photoUrl") { // Skip photoUrl in body if file was uploaded
          loggedInUser[key] = req.body[key];
        }
      });

      await loggedInUser.save();
      
      res.json({
        message: `${loggedInUser.firstName}, your profile updated successfully`,
        data: loggedInUser
      });
    } catch (err) {
      return res.status(400).json({ error: err.message }); // Fixed response format
    }
  }
);

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
    return res.status(400).send("ERROR:"+err.message)
  }
})


module.exports= profileRouter;