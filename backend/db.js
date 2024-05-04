const mongoose = require("mongoose");



const connectDb = async ()=>{
    try {
       const connectionInstance =  await mongoose.connect(process.env.MONGO_URI,{
            dbName:"Paytm"
        });
        console.log("database is connected: ",connectionInstance.connection.host);
    }catch (error) {
        console.log("mongodb connection failed!",error.message);
        process.exit(1);

    }
}


module.exports = connectDb;