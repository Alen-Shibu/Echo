import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'

export const register = async(req,res) => {
    try {
    const {userName,email,password} = req.body;
    const userNameTrimmed = userName?.trim();
    const emailTrimmed = email?.trim();

    // Checking if the input data is correct
    if(!userNameTrimmed) return res.status(400).json({message:"User Name is required"})
    if(!emailTrimmed) return res.status(400).json({message:"Email is required"})
    if(!password?.trim()) return res.status(400).json({message:"Password is required"})

    if(password?.trim().length<5) return res.status(400).json({message:"Password should be atleast 5 characters"})
    
    //Check if email is in valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    //Checking if user already exists in DB
    const normalizedEmail = emailTrimmed.toLowerCase()
    const existingUser = await User.findOne({email: normalizedEmail})
    if(existingUser) return res.status(409).json({message:"Email already exists"})

    //PAssword Hashing for safety
    const hashedPassword = await bcrypt.hash(password,10)

    //Saving User to DB
    const newUser = new User({
        userName: userNameTrimmed,
        email: normalizedEmail,
        password: hashedPassword
    })
    await newUser.save()

    generateToken(newUser._id,res)

    res.status(201).json({
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        profilePic: newUser.profilePic
    })
    
    } catch (error) {
        console.log('Error in register controller',error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}