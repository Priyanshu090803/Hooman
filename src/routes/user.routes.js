const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../Middleware/auth.middleware.js");
const connectionRequestModel = require("../models/connection.model.js");
const { connection } = require("mongoose");
const UserModel = require("../models/user.model.js");

const USER_SAFE_DATA="firstName lastName age skills about gender photoUrl"

userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        if(!loggedInUser){
           return res.status(400).json({message:"User not logged in"})
        }
        const connectionRequest = await connectionRequestModel.find({ // returns array of object
            toUserId:loggedInUser._id,     //toUser id wo h jise req bhji , yha pe hame conn req bhji toh touserid is loggedInUser id 
            status:"interested"  // it should be interested
        }).populate("fromUserId",USER_SAFE_DATA) // use to join data. [yha pe populate lgake ek document add kr diya]
        //mongoose thing, slower, simple jgh m use kro, // ho ske to aggregation pipeline likho
        res.json({
            message:"Data fetched sucessfully",
            data:connectionRequest
        })
    } catch (error) {
        res.statusCode(400).send("ERROR:"+error.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{ // yha connection unka hoga jo jisne req ko send ki h wo bhi accept hui, //req
                                                             // jo ayi h wo bhi accept hui h           
    try {
        const loggedInUser = req.user;
        if(!loggedInUser){
           return res.json({message:"User not logged in!"})
        }
        const connectionData = await connectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},  // dono check lga diya h(ham reciver hai and hmne accept ki )
                {fromUserId:loggedInUser._id,status:"accepted"} // ham sender hai and hmara connection accept hua
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)

        const data = connectionData.map((row)=>{ // bhot imp h ye...
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){  // priyanshu id logged In
                return row.toUserId   // agr priyanshu=>nikita(req bhji and accepted)  toh(toUserId)[means priyanshu k usme nikita ki id dikaho]
            }
            return row.fromUserId   // 2nd case : agr nikita=>priyansh(req bhji and priyanshu accepted) to[fromUser id dikhao][means nikita ki id dikhao bcz abhi priyanshu k usme logged in hai and fromUser id nikita ki hai(sender)]
        })

        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(404).send({message:error.message})
    }
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try {
         let limit = parseInt(req.query.limit) || 10;
         limit= limit>50?50:limit;  // check karo agr limit 50 se jyda hai? agr hai to max 50 limit kardo warna limit jitni mangi utni do
         const page= parseInt(req.query.page)||1;
         const skip = (page-1)*limit
        // user shouldn't see:// his card//ignored cards //connections card //already sent connection request 
        const loggedInUser = req.user;
        if(!loggedInUser){
           return res.status(404).json({message:"User is not logged in"})
        }
        const connectionRequests = await connectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}// agar hamne ya hame kisi ne req bhji h
            ]
        })
        const hideFeedFrom = new Set()
        connectionRequests.forEach((users)=>{
            hideFeedFrom.add(users.toUserId.toString()),
            hideFeedFrom.add(users.fromUserId.toString())
        })
        const users = await UserModel.find({
            $and:[
                {_id:{$nin: Array.from(hideFeedFrom)}},   //  (Not In) Operator
                {_id:{$ne:loggedInUser._id}}            //(Not Equal) Operator
            ]
        }).select(USER_SAFE_DATA).limit(limit).skip(skip) // mongodb understand skip not page:
        res.send(users)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

module.exports= userRouter