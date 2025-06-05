const express = require("express");
const { userAuth } = require("../Middleware/auth.middleware");
const connectionRequestModel = require("../models/connection.model");
const UserModel = require("../models/user.model");
const connectReqRouter= express.Router();


connectReqRouter.post("/sendConnectionReq/send/:status/:touserId",userAuth,async(req,res)=>{ // from user id 
    try {
        const toUserId= req.params.touserId             // to whom we sending id
        const fromUserId= req.user._id                  //sender id
        const status = req.params.status                 // status: ignored or interested

        if(!toUserId || !fromUserId){
            throw new Error("User Ids are required")
        }
        const isUserExist = await UserModel.findById(toUserId)
        if(!isUserExist){
            throw new Error("User not exist!")
        }
        
        const validStatus = ["interested","ignored"]
        if(!validStatus.includes(status)){
            throw new Error("Invalid status")
        }
        const toUser = await UserModel.findById(toUserId) 
        if(!toUser){
            throw new Error ("User not found")
        }

        // if connection already exist logic
        const existedConnection = await connectionRequestModel.findOne({// this queryy will fast now . bcz we added compound index
            $or:[
                {fromUserId,toUserId},             // if fromuser or to user exist(connection already exist)
                {fromUserId:toUserId,toUserId:fromUserId} // if request is already sent
            ]
            
        })

        if(existedConnection){
            throw new Error("Connection already exist!")
        }
        const connectionRequest = new connectionRequestModel({
            fromUserId:fromUserId,
            toUserId: toUserId,
            status:status
        })

        const data = await connectionRequest.save()
        res
        .json({
            message:`${req.user.firstName} ${status} to ${toUser.firstName}`,
            data
        })
    } catch (error) {
        res.status(400).send("Error"+error.message)
    }
})

connectReqRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{ // requestId , connection jo bana tha upr uski id hai 
    try {
        const loggedInUser = req.user;  // ye wo user hoga jise req bhji h
        const {status,requestId}=req.params;

        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Status not allowed!"})
        }

        const connectionRequest = await connectionRequestModel.findOne({  // pura connection request hai ye 
            _id: requestId,            // ye connection ki req id hai not user ki           
            toUserId:loggedInUser._id,    // toUserId(jo connection hai uske andr toUser id wo hai jise req bhji hai ) and is this case we 
                                         // behaving as toUserId .
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(400).json({
                message:"Connnection request not found"
            })
        }
        connectionRequest.status = status  // interested se ab accepted ho gya status , jo status likha h wo params wala staus dalre h
        const data= await connectionRequest.save()
        res.status(200).json({
            message:"Connection request "+status, data
        })
    } catch (error) {
        res.status(400).send("ERROR"+error.message)
    }
})

module.exports= connectReqRouter;