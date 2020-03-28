const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    method : {
        type: String,
        enum : ['local','facebook','google'],
        required : true
    },
    local : {
        email : String,
        password : String   
    },
    google : {
        id : String,
        email : String
    },
    facebook : {
        id : String,
        email: String
    }
})

module.exports = mongoose.model('user',userSchema)