

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");

const userAuth = async(req,res,next)=>{
  try{
   const {token} = req.cookies;
   if(!token){
    return res.status(401).send("Please login!");
   }
   const decodeObj =  jwt.verify(token,"DevTinder$333");
   const {_id} = decodeObj;
   const user = await UserModel.findById(_id);
   console.log(user)
   if(!user){
    return res.status(400).send("User not found");
   }
   req.user = user;
   next()
}catch(err){
    return res.status(400).send("ERROR:"+err.message)
}
}
module.exports={userAuth}
