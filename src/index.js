const express = require("express");
const { PORT } = require("./constants");
const { connect } = require("./database");
const { crudRouter } = require("./routers/crudRouter");
const cookieParser = require('cookie-parser');
const app = express();

// adding json parser middleware
app.use(express.json())
// adding cookieparser middleware
app.use(cookieParser());


// adding router

app.use("/",crudRouter)


connect().then(()=>{
    app.listen(PORT,()=>{
        console.log('server is listening to port '+PORT)
    })
}).catch(console.log)

