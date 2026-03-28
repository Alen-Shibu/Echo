import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const register = async(req,res) => {
    try {
    const {userName,email,password} = req.body;
    const userNameTrimmed = userName?.trim();
    const emailTrimmed = email?.trim();
    const passwordTrimmed = password?.trim();

    // Checking if the input data is correct
    if(!userNameTrimmed) return res.status(400).json({message:"User Name is required"})
    if(!emailTrimmed) return res.status(400).json({message:"Email is required"})
    if(!passwordTrimmed) return res.status(400).json({message:"Password is required"})
    if (userNameTrimmed.length < 3 || userNameTrimmed.length > 15) return res.status(400).json({ message: "Username must be between 3 and 15 characters" })

    // Check for leading/trailing spaces
    if(password !== passwordTrimmed) return res.status(400).json({message: "Password cannot start or end with a space"})

    if(passwordTrimmed.length<5) return res.status(400).json({message:"Password should be atleast 5 characters"})
    
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
    const hashedPassword = await bcrypt.hash(passwordTrimmed,10)

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
        console.error('Error in register controller',error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const login = async(req,res) => {
    try {
        const {email,password} = req.body

        if(!email?.trim()) return res.status(400).json({message:"Email is required"})
        if(!password?.trim()) return res.status(400).json({message:"Password is required"})

        const normalizedEmail = email.trim().toLowerCase()
        const passwordTrimmed = password?.trim();

        // Check for leading/trailing spaces
        if(password !== passwordTrimmed) return res.status(400).json({message: "Password cannot start or end with a space"})

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email: normalizedEmail})
        if(!user) return res.status(401).json({message:"Invalid Credentials"})

        const isPasswordCorrect = await bcrypt.compare(passwordTrimmed,user.password)
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid Credentials"})

        generateToken(user._id,res)

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.error('Error in login controller:',error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const logout = (_,res) => {
    try {
        res.cookie("jwt","",{
            maxAge:0,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development"
        })
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.error("Error in logout controller",error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const updateProfile = async(req,res) => {
    try {
        const {profilePic} = req.body
        if(!profilePic) return res.status(400).json({message: "profile pic not provided"})

        const userId = req.user._id

        const existingUser = await User.findById(userId)
        if (existingUser.profilePic) {
            const publicId = existingUser.profilePic.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(publicId)
        }

        let cloudImg
        try {
            const cloudUpload = await cloudinary.uploader.upload(profilePic, {
                resource_type: "image",
                folder: "profile_images",       // organise in Cloudinary
                transformation: [{ quality: "auto", fetch_format: "auto" }], // optimise
            });
            cloudImg = cloudUpload.secure_url
        } catch (error) {
            return res.status(400).json({ message: "Image upload failed" })
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:cloudImg},{new:true}).select('-password')

        res.status(200).json({ message: "Profile pic updated", updatedUser })
    } catch (error) {
        console.error("Error in updateProfile controller",error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const updateUserName = async(req,res) => {
    try {
        const {newUserName} = req.body;
        const newUserNameTrimmed = newUserName?.trim()

        if(!newUserNameTrimmed) return res.status(400).json({message: "New Username not provided"})
        if(newUserNameTrimmed === req.user.userName) return res.status(400).json({message: "New username must be different from current one"})
        if (newUserNameTrimmed.length < 3 || newUserNameTrimmed.length > 15) return res.status(400).json({ message: "Username must be between 3 and 15 characters" })

        const updatedUser = await User.findByIdAndUpdate(req.user._id,{userName: newUserNameTrimmed},{new:true}).select('-password')

        res.status(200).json({message: "Username updated",updatedUser})
    } catch (error) {
        console.error('Error in updateUserName endpoint',error)
        return res.status(500).json({message: "Internal server error"})
    }
} 

export const updatePassword = async(req,res) => {
    try {
        const {password,newPassword} = req.body;
        const passwordTrimmed = password?.trim();
        const newPasswordTrimmed = newPassword?.trim();

        if(!passwordTrimmed) return res.status(400).json({message:"Old Password is required"})
        if(!newPasswordTrimmed) return res.status(400).json({message:"New Password is required"})
        if(newPassword !== newPasswordTrimmed) return res.status(400).json({message: "Password cannot start or end with a space"})
        if(newPasswordTrimmed.length<5) return res.status(400).json({message:"Password should be atleast 5 characters"})
        if (passwordTrimmed === newPasswordTrimmed) return res.status(400).json({ message: "New password must be different from current one" })

        const user = await User.findById(req.user._id)
        const isPasswordCorrect = await bcrypt.compare(passwordTrimmed,user.password)
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid password"})

        const hashedPass = await bcrypt.hash(newPasswordTrimmed,10)

        await User.findByIdAndUpdate(req.user._id,{password: hashedPass})
        res.status(200).json({message: "Password Updated"})
    } catch (error) {
        console.error('Error in updatePassword endpoint',error)
        return res.status(500).json({message: "Internal server error"})
    }
}