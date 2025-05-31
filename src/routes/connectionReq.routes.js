const express = require("express");
const { userAuth } = require("../Middleware/auth.middleware");
const connectReqRouter= express.Router();


connectReqRouter.post("/sendConnectionReq",userAuth,async(req,res)=>{
    const user=req.user;
    console.log("Connection req send")
    res.send(`${user.firstName} ${user.lastName} sent a connectin request!!`)
})

module.exports= connectReqRouter;