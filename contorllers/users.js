const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
    signup : async (req,res,next)=>{
        const {email , password} = req.body
        const foundUser = await User.findOne({'local.email':email})
        if(foundUser){
            return res.status(403).json({msg : "Email Already in use"})
        }
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const newUser = new User({
            method : 'local',
            local : {
                email:email,
                password:hash
            }
            
        })
        await newUser.save()
        // here I generate token to user because if I don't to login after signUp , so I create token to him for access recourses
        const token = jwt.sign({ user_id : newUser.id },'remahAmr',{expiresIn : "1d"})
        res.status(200).json({token,msg:"User Created !"})
    },
    
    singin : async (req,res,next) => {
        // I enter here If he pass the localStrategy authentication
        const token = jwt.sign({ user_id : req.user._id },'remahAmr',{expiresIn : "1d"})
        res.status(200).json({token,msg:"User Logged In Locally!"})
    },

    secret : async (req,res,next)=>{
        res.json({
            user : req.user
        })
    },

    googleOauth : async(req,res,next) => {
        const token = jwt.sign({ user_id : req.user._id },'remahAmr',{expiresIn : "1d"})
        res.status(200).json({token,msg:"User Logged In With google !"})
    },

    facebookOauth : async(req,res,next) => {
        const token = jwt.sign({ user_id : req.user._id },'remahAmr',{expiresIn : "1d"})
        res.status(200).json({token,msg:"User Logged In With facebook  !"})
    }
}