const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const bcrypt = require('bcryptjs')

const User = require('./models/user')

const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies['access_token']        
    }
    return token
}

passport.use(new JwtStrategy({
    // jwtFromRequest : ExtractJwt.fromHeader('authorization'),// here I store cookie in localStorage
    jwtFromRequest: cookieExtractor,
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
        const user = await User.findOne({'local.email':email}) // I put await after async function
        if(!user) {return done(null,false)}
        // if password correct
        const isMatch = await bcrypt.compare(password,user.local.password)
        if(!isMatch) {return done(null,false)} // if here I don't write return so he will go to : done(null,user)
        // return user
        done(null,user)
    } catch(err){
        done(err,false)
    }
}))


// here I catch the "access_token" from body , then Extract profile Infromation of the user and Store his info in Database
// after that I will generate token to him for access any recources he need 
passport.use("googleToken",new GooglePlusTokenStrategy({
    clientID : '848821189810-gotr531nutova0mhrlsmd8gt9q14s3ph.apps.googleusercontent.com',
    clientSecret : 'hY0fzKsbncZa0g0pqjTNZp_F',
    passReqToCallback : true,
},async(req,accessToken,refreshToken,profile,done)=>{
   try {
    // You can pass req "To All Passport Functions" to see if user already logged in or not , type => console.log(req)
    // Check if user existing in google's account
    let existingUser = await User.findOne({'google.id':profile.id})
    if(existingUser){
        console.log('existing')
        return done(null,existingUser)
    }
    console.log('not exists')
    
    // if email found in DB in local's , so merge it 
    existingUser = await User.findOne({'local.email':profile.emails[0].value})
    if(existingUser){
        existingUser.methods.push('google')
        existingUser.google = {
            id : profile.id,
            email : profile.emails[0].value
        }
        await existingUser.save()
        return done(null,existingUser)
    }
    // save User
    const newUser = new User({
        methods : ['google'],
        google : {
            id : profile.id,
            email : profile.emails[0].value
        }
    })
    await newUser.save()
    // return User
    done(null,newUser)
   } catch(err) {
        done(err,false,err.message)
   }
}))


passport.use('facebookToken',new FacebookTokenStrategy({
    clientID: '201044157854125',
    clientSecret: '17c0cf0d87b94cdbb51cab8f39c84616'
},async (accessToken,refreshToken,profile,done) => {
    console.log("profile",profile);
    try {
        // Check if user existing in facebook's accounts
        let existingUser = await User.findOne({'facebook.id':profile.id})
        if(existingUser){
            console.log('existing')
            return done(null,existingUser)
        }
        //if email found in local's accounts , so merge it 
        existingUser = await User.findOne({'local.email':profile.emails[0].value})
        if(existingUser){
            existingUser.methods.push('facebook')
            if(existingUser){
                existingUser.facebook = {
                    id : profile.id,
                    email : profile.emails[0].value
                }
                await existingUser.save()
                return done(null,existingUser)
            }

        }
        // save User
        const newUser = new User({
            methods : ['facebook'],
            facebook : {
                id : profile.id,
                email : profile.emails[0].value
            }
        })
        await newUser.save()
        // return User
        done(null,newUser)
       } catch(err) {
            done(err,false,err.message)
       }
}))