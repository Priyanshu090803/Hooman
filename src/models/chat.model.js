const mongoose = require('mongoose')


const messageSchema =  mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required:true,
    },
    text:{
        type: String,
        required: true
    }
},{
    timestamps:true
})

const ChatSchema = new mongoose.Schema({
    participants:[{       // participants are array bcz participants can be more than 2
        type: mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    }],
    messages:[messageSchema]
})

const Chat = mongoose.model("Chat",ChatSchema)
module.exports= {Chat}