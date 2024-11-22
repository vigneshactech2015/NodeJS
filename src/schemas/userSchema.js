const mongoose = require("mongoose");

const {Schema} = mongoose

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18,
        max : 60,
        required : true
    },
    userName:{
        type:String,
        required:true,
        unique: true
    },
    password: {
        type:String,
        required:true
    }
}) 


module.exports = {userSchema}