const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const {isAuth} = require('./middleware/isAuth')
const User = require('./models/User')

const app = express()

app.use(bodyParser.json())

app.get('/api',isAuth,(req,res) => {
    res.json({
        msg : "hello from my server",
        userId: req.user._id,
        user : req.user 
    })

})

app.post('/api/signup',async (req,res)=>{

    try{
        const user = await User.findOne({email: req.body.email})
    if(user){
        res.json({
            msg: "Email Already in use"
        })
    } 
    else {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        const result = await newUser.save()
        res.json({result})
    
    }
    } catch(err){
        res.json(err)
    }
    
})

app.post('/api/login',async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(user){
            const isMatch = await bcrypt.compare(req.body.password,user.password)
            if(!isMatch)
            {
                res.json({
                    msg: "Password incorrect"
                })
            }
            else{
                var token = jwt.sign({user},'remah',{expiresIn : '30s'})
                res.json({
                    token,
                    user
                })
            }
        }
        else {
            res.json({
                msg: "Email not found!"
            })
        }
    } catch(err){
        res.json(err)
    }
})


// function isAuth (req,res,next){
//     const token = req.headers['authorization']
//     if(token){
//         try{
//             var authData = jwt.verify(token,'remah')
//             req.user = authData.user
//             next()   
//         } catch(err){
//             res.json(err)
//         }
//     } else {
//         res.status(403).json({
//             msg : "FOR bidden"
//         }) 
//     }
// }

mongoose.connect('mongodb+srv://remah:remah654312@cluster0-ytypa.mongodb.net/LoginSystem?retryWrites=true&w=majority',{
    useNewUrlParser: true , useUnifiedTopology: true
},() => {
    console.log('mongodb connected');
    
})

app.listen(3000,()=>{
    console.log('server started successfully');
})