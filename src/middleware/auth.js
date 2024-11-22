const express = require('express')

const app = express()

app.use((req,res,next)=>{
    try{
    const token = req.cookies.token
    if(token && token.length>=1){
        next()
    }else {
        return  res.status(401).send("Not authorized")
    }}
    catch(err){
        res.status(500).send("something went wrong")
    }
})


module.exports = {authMiddleware:app}
