const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/api',isAuth,(req,res) => {
    res.json({
        msg : "hello from my server"
    })

})

app.post('/api/login',(req,res)=>{
    const user = {
        name : 'remah',
        id : 1
    }
    var token = jwt.sign({user},'remah')
    res.json(token)
})

app.post('/api/post',isAuth ,(req,res) => {
    res.json({
        msg: "post created",
        userId: req.user.id
    })
})

function isAuth (req,res,next){
    const token = req.headers['authorization']
    if(token){
        try{
            var authData = jwt.verify(token,'remah')
            req.user = authData.user
            next()   
        } catch(err){
            res.json(err)
        }
    } else {
        res.status(403).json({
            msg : "FOR bidden"
        }) 
    }
    
}

app.listen(3000,()=>{
    console.log('server started successfully');
})