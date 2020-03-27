const User = require('../models/user')
const jwt = require('jsonwebtoken')


module.exports = {
    signup : async (req,res,next)=>{
        const {email , password} = req.body
        const foundUser = await User.findOne({email})
        if(foundUser){
            return res.status(403).json({msg : "Email Already in use"})
        }
        const newUser = new User({
            email,password
        })
        await newUser.save()
        
        const token = jwt.sign({ user_id : newUser.id },'remahAmr',{expiresIn : "1d"})
        res.status(200).json({token,msg:"User Created !"})
    },
    
    singin : async (req,res,next) => {
        res.json('lolo')
    },

    secret : async (req,res,next)=>{
        res.json({
            user : req.user
        })
    }
}