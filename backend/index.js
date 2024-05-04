require("dotenv").config();
const express = require("express");
const connectDb = require("./db");
const userRoutes = require("./route");
const cors = require("cors");
const app = express();
const port =  process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"*",   
}))



app.get("/",(req,res)=>{
    res.send("home page");
});
app.use("/api/v1/user",userRoutes);




connectDb().then(()=>{
    app.listen(port,()=>{
        console.log("server is listening on port:",port);
    });
}).catch(()=>{
    console.log("database connection failed");
});




