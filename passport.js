const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const User = require('./models/user')

passport.use(new JwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : 'remahAmr'    
},async (payload,done) => { // if token verified correctly , so will enter to this function
    try{
        // Check if user exists 
        const user = await User.findById(payload.user_id)
        // if user doesn't exist (extra assurance)
        if(!user) {return done(null,false)}
        // successful , return user
        done(null,user) // put user in : req.user
    } catch(err){
        done(err,false)
    }
}))


passport.use(new LocalStrategy({
    usernameField: 'email'
},async (email,password,done) => {
    try {
        // if user exist
        const user = await User.findOne({email}) // I put await after async function
        if(!user) {return done(null,false)}
        // if password correct
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) {return done(null,false)} // done like next , if here I don't write return so he will go to : done(null,user)
        // return user
        done(null,user)
    } catch(err){
        done(err,false)
    }
}))