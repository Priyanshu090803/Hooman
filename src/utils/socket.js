const socket = require("socket.io");
const crypto = require('crypto')
const {Chat} = require("../models/chat.model.js");


const getSecretRoomId = ({userId,targetUserId})=>{
      if (!userId || !targetUserId) {
        throw new Error('Both userId and targetUserId are required');
    }
    return crypto
           .createHash("sha256")
           .update([userId,targetUserId].sort().join('_'))
           .digest('hex')
}

const initializeSocket = (server)=>{
    const io = socket(server,{
        cors:{
        origin: [
          'http://localhost:3000', // Your frontend URL      // WHITELISTING  THE DOMAINS (koi bhi domain use kr skte h)
          'https://yourproductiondomain.com',
          'https://www.yourproductiondomain.com',
          'http://localhost:5173',
  ]}
});
    io.on("connection",(socket)=>{
        socket.on("joinChat",({userId,targetUserId})=>{    // creating a room
               // Add validation
                if (!userId || !targetUserId) {
                    socket.emit("error", { message: "Missing required parameters" });
                    return;
                }
            const roomId= getSecretRoomId({userId,targetUserId})    // creating a unique room id// or ye room id 2 logo k beech ki same honi chahiye
            //  console.log(firstName+" "+roomId)                       // that's why we are sorting and joining it
            socket.join(roomId)                                     // join krke room banta hai
        })  // fromtend m bhi same hone chahiye
        socket.on("sendMessage",async({firstName,userId,targetUserId,text})=>{
            try{
                if (!firstName || !userId || !targetUserId || !text) {
                    socket.emit("error", { message: "Missing required message parameters" });
                    return;
                }
                 const trimmedText = text.trim();
                if (!trimmedText) {
                    socket.emit("error", { message: "Message cannot be empty" });
                    return;
                }


            const roomId =  getSecretRoomId({userId,targetUserId})
            console.log(firstName +" "+ text)
            let chat = await Chat.findOne({     // check karo chat exist krti hai ya nahi
                participants:{$all:[userId,targetUserId]}
            })
            if(!chat){           // if chat exist ni krti hai to nayi bnao
             chat = new Chat({
                participants:[userId,targetUserId],
                messages:[]
             })
            }
            chat.messages.push({    // if chat exist krti hai to naye msg append kro
                senderId: userId,
                text
            })
            await chat.save()
            io.to(roomId).emit("messageRecieved",{firstName,text}) //messageRecieved ye nya event bnaya for messages                 // io.to(for that room id) and then emit matlab bhjna

        }catch(err){
            console.log(err)
        }
    
    })
        socket.on("disconnect",()=>{})
    })
}

module.exports = initializeSocket;
