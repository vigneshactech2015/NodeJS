const express = require('express');
const mongoose = require('mongoose');
const { userSchema } = require('../schemas/userSchema');
const {authMiddleware} = require('../middleware/auth'); 
const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../constants');
const bcrypt = require("bcryptjs")
const app = express();


const User = mongoose.model('User', userSchema)

app.post('/signup',async (req,res)=>{
    try{
        const {userName,password,firstName,lastName,age} = req.body
        // save encrypted password to DB by using bcrypt
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            userName: userName,
            password: hashedPassword,
            firstName : firstName,
            lastName : lastName,
            age : age,
        })
        await newUser.save()
        res.send("User registered successfully")
    }catch(err){
        res.status(400).send(err)
    }
})


app.get('/login',async (req,res) => {
    try{
    const {userName,password} = req.query;
    // get password and compare the password and set the cookies

    const user = await User.findOne({userName:userName})
    
    if (!user) {
        return res.status(400).send("Invalid username or password");
    }

    //compare already saved db password with currently typed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).send("Invalid username or password");
    }

    // Generate and save the jwt token on password match
    const token = jwt.sign({ userId: user._id, userName: user.userName }, JWTSECRET, { expiresIn: '1h' });

    // Set the token in the cookie
    res.cookie('token', token);    
    res.send("User logged in successfully");

    }catch(err){
        res.send(err)
    }
})

app.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.send("User logged out successfully");
});



app.get('/users', authMiddleware ,  async (req, res) => {
    try{
        const userDetails = await User.find({}).select(["firstName","lastName","age"])
        res.send(userDetails)
    }catch(err){
        res.status(400).send("Error in finding users" + err)
    }

})


app.delete('/user/:userId', authMiddleware , async (req,res)=>{
    try{
        const {userId} = req.params
        await User.deleteOne({_id : userId})
        res.send("User deleted successfully")
    }catch(err){
        res.status(400).send("Error in deleting the user" + err)
    }
})

app.patch('/user/:userId', authMiddleware ,async (req,res) => {
    try {
        const {userId} = req.params;
        await User.findByIdAndUpdate(userId,req.body)
        res.send("User updated successfully")
    }catch(err){
        res.status(400).send("Error in updating the user" + err)
    }
})

module.exports = { crudRouter: app }