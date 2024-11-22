const mongoose = require('mongoose');
const { DBURL } = require('./constants');


const connect = async () => {
    try{
        await mongoose.connect(DBURL)
    }catch(err){
        console.error("Database connection failed")
    }
    
}

module.exports = {connect}
