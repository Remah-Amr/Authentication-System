const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

// midlleware
app.use(morgan('dev'))
app.use(bodyParser.json())

// routes
app.use('/users',require('./routes/users'))

// connect mongodb
mongoose.connect('mongodb+srv://remah:remah654312@cluster0-ytypa.mongodb.net/ApiAuthentication?retryWrites=true&w=majority',
    {useNewUrlParser: true,useUnifiedTopology:true},()=>{
    console.log('mongodb connected')
})

// port
app.listen(3000,()=> console.log('server started successfully !'))