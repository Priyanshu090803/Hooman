const express = require('express')
const { userAuth } = require('../Middleware/auth.middleware');
const { Chat } = require('../models/chat.model');
const chatRouter = express.Router()

chatRouter.get('/chat/:targetUserId',userAuth,async(req,res)=>{
    const userId = req.user._id;
    const {targetUserId} = req.params
    if(!userId){
        return res.json("user id not found")
    }
    if(!targetUserId){
        return res.json("user id not found")
    }
    try {
        let chat = await Chat.findOne({
            participants:{$all:[userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:' firstName lastName photoUrl'
        })
        if(!chat){
            chat = new Chat({
                participants:[userId,targetUserId],
                messages:[]
            })
        }
        await chat.save()
        res.json(chat)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
})


module.exports = chatRouter