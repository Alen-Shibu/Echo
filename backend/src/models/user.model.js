import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    profilePic:{
        type:String,
        default:""
    },
    lastSeen:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema)

export default User