const express = require("express");
const connectReqRouter= express.Router();
const userAuth = require("../Middleware/auth.middleware.js")


connectReqRouter.post("/sendConnectionReq",userAuth,async(req,res)=>{
    const user=req.user;
    console.log("Connection req send")
    res.send(`${user.firstName} ${user.lastName} sent a connectin request!!`)
})

module.exports= connectReqRouter;