// Schema page


const mongoose=require("mongoose");
const validator=require("validator");
const blockedDomains = ["tempmail.com", "10minutemail.com", "fakeemail.com"];
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:60,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        minlength:1,
        maxlength:40,
        trim:true
    },
    
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address"+value);
            }
            const emaildomain= value.split("@")[1];

            if(blockedDomains.includes(emaildomain)){
                throw new Error("Temporary email addresses are not allowed.");
            }
        }
    },
    password:{
        type: String,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error ("Please Enter a strong password"+value)
            }
        }
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Enter valid gender");  
            }
        },
        lowercase:true,

    },
    age:{
        type:Number,
        // required:true,
        min:12
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url address"+value);
            }
            
        }
    },
    about:{
        type:String,
        default:"Hey I am using DevTinder"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true 
})


userSchema.methods.getJWTtoken= async function(){
    const user= this; // here this will represent to the instance of USer Model which will be user:eg => Priyanshu as user(by this);

    const token= jwt.sign({_id:user._id},"DevTinder$333",{
        expiresIn:"1d"
    })
    return token;
}

userSchema.methods.validatePassword= async function(inputPassByUser){
    const user = this;
    const passwordHash =user.password;
    const isPasswordValid = await bcrypt.compare(
        inputPassByUser,passwordHash
    )
    return isPasswordValid;
}


module.exports= mongoose.model("UserModel",userSchema)


