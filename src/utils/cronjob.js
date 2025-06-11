const cron = require("node-cron")


cron.schedule('* * * * * *',()=>{
    console.log("hello world", new Date())
}) 