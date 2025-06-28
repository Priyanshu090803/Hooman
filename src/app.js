const dotenv = require('dotenv')
const express=require('express'); 
const app=express();
const connectDB = require("./config/database")
const cookiesParser = require("cookie-parser");
const http = require("http")
const cors = require("cors")// cors use krenge bcz, backend ko same domain and ip chahiye hota h due to cors policy and cors use krke ye khtm hog
                            // jata h
    

dotenv.config({
    path:"./.env"
})  


// require("./utils/cronjob.js")
// app.use(cors({ 
//     origin: [
//     'http://localhost:3000', // Your frontend URL      // WHITELISTING  THE DOMAINS (koi bhi domain use kr skte h)
//     'https://yourproductiondomain.com',
//     'https://www.yourproductiondomain.com',
//      'http://localhost:5173',
//   ],  
//     credentials:true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))   
// app.use(cors({
//     origin:'*',
//     credentials:true
// }))   
 
   // now cors error will not come
// app.use(cors({
//     origin: [
//       'http://localhost:8080',
//       'https://yourproductiondomain.com',
//       'https://www.yourproductiondomain.com',
//       'http://localhost:5173'
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));


app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:5173',
      'https://hooman090803.vercel.app',
      'https://hooman090803-git-main-priyanshu-chandra-tamias-projects.vercel.app',
      /https:\/\/.*\.vercel\.app$/ // Regex for all Vercel preview URLs
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json())
app.use(cookiesParser())

const authRouter = require('./routes/authRouter.routes.js')
const connectReqRouter = require("./routes/connectionReq.routes.js")
const profileRouter = require ('./routes/profileRouter.routes.js')
const userRouter = require("./routes/user.routes.js");
const chatRouter= require('./routes/chat.routes.js')
const initializeSocket = require('./utils/socket.js');

app.use("/",authRouter);
app.use("/",connectReqRouter);
app.use("/",profileRouter)
app.use("/",userRouter)
app.use("/",chatRouter)
const server = http.createServer(app) // server bnaenge for socket.io 
initializeSocket(server)          // ye helper fucntion hai for socket.io which take server

connectDB().then(()=>{
    console.log('Database connected sucessfully')
    const port=3000;
    server.listen(port,(req,res)=>{           // app.listen k jgh server use kiya for using socket.io
        console.log('server started sucessfully')
    })
    
}).catch((err)=>{
    console.log(err)
    console.log("Database did't connected")
})
