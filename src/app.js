const dotenv = require('dotenv')
const express=require('express'); 
const app=express();
const connectDB = require("./config/database")
const UserModel = require('./models/user.model.js');
const cookiesParser = require("cookie-parser");
const cors = require("cors")// cors use krenge bcz, backend ko same domain and ip chahiye hota h due to cors policy and cors use krke ye khtm hog
                            // jata h
app.use(cors({ 
    origin: [
    'http://localhost:3000', // Your frontend URL      // WHITELISTING  THE DOMAINS (koi bhi domain use kr skte h)
    'https://yourproductiondomain.com',
    'https://www.yourproductiondomain.com'
  ],  
    credentials:true
}))    
dotenv.config({
    path:"./.env"
})   
   // now cors error will not come
app.use(express.json())
app.use(cookiesParser())

const authRouter = require('./routes/authRouter.routes.js')
const connectReqRouter = require("./routes/connectionReq.routes.js")
const profileRouter = require ('./routes/profileRouter.routes.js')
const userRouter = require("./routes/user.routes.js")

app.use("/",authRouter);
app.use("/",connectReqRouter);
app.use("/",profileRouter)
app.use("/",userRouter)




// getting user email id:
app.get("/user",async(req,res)=>{
    const EmailId=req.body.Email;

    try{
        const userss= await UserModel.find({Email:EmailId})
        if(userss.length===0){
            res.status(404).send("Can't find user Email")
        }else{
            res.send(userss);   
        }
    }
    catch(err){
        res.status(400).send("something went wrong")
    }
})

// getting all the users without sending any specific request:

app.get("/feed",async(req , res)=>{
    
    try{
        userss= await UserModel.find({});
        res.send(userss)
    }
    catch(err){
        res.status(400).send("something went wrong")
    }
})
//  DELETING A USER:
 app.delete('/user',async(req,res)=>{
    const dltUser=req.body._id;
    try{
        // const user= UserModel.findByIdAndDelete({_id:dltUser});
        const user= await UserModel.findByIdAndDelete({dltUser});

        res.send("user deleted sucessfully");
    }
    catch(err){
        res.status(404).send("something went wrong")
    }
 })



    // app.patch("/user/:userId",async(req,res)=>{
    //     const data=req.body;
    //     const UpdateUserId= req.params?.userId;
        
    //     try{
    //         const ALLOWED_UPDATES=["firstName","lastName","password","gender","age","photoUrl","about","skills"];
    //         let isUpdateAllowed = Object.keys(data).every((k)=>
    //             ALLOWED_UPDATES.includes(k)
    //         )
    //         if(!isUpdateAllowed){
    //             throw new Error("Update not allowed")
    //         }

    //         if(data?.skills.length>10){
    //             throw new Error("Can't take more than 10 skills")
    //         }

    //         await UserModel.findByIdAndUpdate({_id:UpdateUserId},   data,{
    //             returnDocument:"after",
    //             runValidators:true
    //         })
    //         res.send("user updated sucessfully")
    //     }catch(err){
    //         res.status(400).send("Something went wrong  "+err.message)
    //     }
    // })







connectDB().then(()=>{
    console.log('Dabase connected sucessfully')
    const port=3000;
    app.listen(port,(req,res)=>{
        console.log('server started sucessfully')
    })
    
}).catch((err)=>{
    console.log("Database did't connected")
})
















































// app.get("/user", async(req,res)=>{
//     const Id = req.body.id;

//     try{
//         const users= UserModel.findById({id:Id});
//         if(user.length===0){
//             res.status(400).send(`can't find the user Email`)
//         }
//         else{ 
//             users.send("User found")
//         }
//     }
//     catch(err){
//         res.status(404).send("something went wrong");
//     }


// })
