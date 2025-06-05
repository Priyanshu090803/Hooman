const { default: mongoose, Schema } = require("mongoose");

const connectionSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    status:{
        type: String,
        enum:{                   // help to do validation
            values:["interested","ignored","accepted","rejected"],  // enum does restrict things. like isse jyda koi cheez dali to it will give error
            message:`{VALUE} is incorrect status  type`
        },
        required:true
    }

},{
    timestamps:true
})
// we created compound index(by putting 1, ab ye ascending order m hoga and jab bhi find krenge ham documents m to api calls optimized and 
// fast hongi bcz hamne index de diya h is compound wali cheez ko) ..... jha pe find() krna ho and if api time lgaegi try to give index , it will
// optimise it
connectionSchema.index({fromUserId:1,toUserId:1}) // Ye compounded hai , means jab dono ko ek sath dudhgenge usme index de dega

connectionSchema.pre("save",function(next){ //pre middleware. db mai jab bhi save querry lagti h (await user.save()) to usse pehle ye hook chlta h
    const connectionReq= this;        // this is here Schema k andr
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){  // checking 
        throw new Error("Can't send request to own")
    }
    next();
})

const connectionRequestModel = mongoose.model("connectionRequestModel",connectionSchema)

module.exports = connectionRequestModel;