const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6,

    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true
    }

})


const User = mongoose.model("User",userSchema);




const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    balance:{
        type:Number,
        required:true,
    }
});



const Account = mongoose.model("Account",accountSchema);

module.exports = {
    User,
    Account
};