const mongoose=require("mongoose")
const connectDB=async()=>{
await mongoose.connect("mongodb+srv://priyanshucourse090803:oH2P9YUjvVvGAiud@devtinder.15bp4.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder/")
}
module.exports =connectDB;  