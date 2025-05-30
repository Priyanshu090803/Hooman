const validator = require("validator");

// const validateSignUp=(req)=>{
//   const {firstName,lastName,email,password} = req.body;
  
//   if(!firstName || !lastName){
//     throw new Error("Name is not valid")
//   }
//   else if(!validator.isEmail(email)){
//     throw new Error("Email is not valid")
//   }
//   else if(!validator.isStrongPassword(password)){
//     throw new Error("Please enter a strong password")
//   }
// }

const validateEditProfileData = (req)=>{
  const canValidate=["firstName","lastName","gender","age","photoUrl","about","skills"];
  Object.keys(req.body).every(value=> canValidate.includes(value))
  return validateEditProfileData;
}



const validateSignUp = (req)=>{
  const {firstName,lastName,email,password} = req.body;
  if(!firstName || !lastName){
    throw new Error("Enter your name")
  }
  if(! validator.isEmail(email)){
    throw new Error("Enter correct email")
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Enter strong password")
  }
  return true; 
}











module.exports= {validateSignUp,validateEditProfileData};
 