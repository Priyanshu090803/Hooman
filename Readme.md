oH2P9YUjvVvGAiud
mongodb+srv://priyanshucourse090803:<db_password>@devtinder.15bp4.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder

1st code 



// app.get("/admin",(req,res)=>{
//     const token='xyz';
//     const isAuthorized=token==="xyz";
//     if(isAuthorized){
//         res.send("All data is send");
//     }
//     else{
//         res.status(401).send("Unauthorized");
//     }
// }
// )

// app.get('/admin/getAllData',(req,res)=>{
//     const token='xyz';
//     const isAuthorized=token==="xyz";
//     if(isAuthorized){
//         res.send("All data is send");
//     }
//     else{
//         res.status(401).send("Unauthorized");
//     }
// })

// app.get('/admin/deleteUser',(req,res)=>{
//     const token='xyz';
//     const isAuthorized=token==="xyz";
//     if(isAuthorized){
//         res.send("All data is send");
//     }
//     else{
//         res.status(401).send("Unauthorized");
//     }
// }
// )


// To make our code clean and small we will use MiddleWear

// app.use("/admin",(req,res,next)=>{
//     const token="xyz";
//     const isAuthorized=token==="xyz";
//     if(!isAuthorized){
//         res.status(401).send("Unauthorized")
//     }
//     else{
//         next();
//         }
// app.get("/admin/getAllData",(req,res)=>{
//     res.send("Sending all the data of the users")
// })    
// app.get("/admin/DeleteData",(req,res)=>{
//     res.send("Deleting the data of the user")
// })
// })

// We can make this code more clean by making middlewear in other files // We will make the middllewear in the Folder:MiddleWear and file : auth.js

const {AdminAuth}=require("./Middlewear/auth")
app.use("/admin",AdminAuth);
app.get("/admin/DeleteData",(req,res)=>{
    res.send("Deleted the data")
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("Getting all data")
})










// app.get("/user/:userId/:name",(req,res)=>{
//     console.log(req.params)
//     res.send("Hello user ji ")
// })

// app.post("/user",(req,res)=>{
//     res.send("Data is saved  ")
// })


// app.delete("/user",(req,res)=>{
//     res.send("Data is deleted sucessfully  ")
// })


// app.patch("/user",(req,res)=>{
//     res.send("Data is pathched  ")
// })


// app.use("/test",(req,res)=>{
//     res.send("Testiinng")
// })

// app.use("/",(req,res)=>{
//     res.send('Hello from the server to the client')
// })

