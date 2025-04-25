const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const accountschema = new mongoose.Schema({
    firstname: {
        type: String,

    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
    
    },
    password: {
        type: String,
        
    },
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    token: {
        type: String,
    },
    tokenExpiresIn: {
        type: Date
    },
    otpverify: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

accountschema.pre("save"  , async function(next){
     if(!this.isModified("password")){
        return next()
  }  
 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt)
 next()
})


module.exports = mongoose.model("Account", accountschema)
