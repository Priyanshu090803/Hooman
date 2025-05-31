const validator = require("validator");


const validateEditProfileData = (req)=>{
  const canValidate=["firstName","lastName","gender","age","photoUrl","about","skills"]; // this logic to check, isi cheez m se hori h profile edit
 Object.keys(req.body).every(value=> canValidate.includes(value)) // object.keys se key ayegi(req.body) like firstName , age etc
    return canValidate                                                         // .every se check hota h and true false ata h.
                                                                  // or .every ke andr canvalidate mai value hai ya nhi h check krra(includes)
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
 