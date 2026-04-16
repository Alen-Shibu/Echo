import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import cloudinary from '../lib/cloudinary.js'
import mongoose from 'mongoose';
import { io, onlineUsers } from '../server.js'

export const getAllContacts = async(req,res) => {
    try {
        const loggedUserId = req.user._id;

        const filteredUsers = await User.find({_id : {$ne : loggedUserId}}).select("-password")
        if(!filteredUsers.length === 0) return res.status(404).json({message: "No other Users yet"})

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error('Error in getAllContacts controller',error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getAllChats = async(req,res) => {
    try {
        const loggedUserId = req.user._id
        const messages = await Message.find({$or: 
            [
                {senderId:loggedUserId},
                {receiverId:loggedUserId}
            ]
        }).select("senderId receiverId")
        const chatId = [...new Set(messages.map((msg)=> msg.senderId.toString() === loggedUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))]
        const chatPartners = await User.find({_id: {$in : chatId}}).select("-password")
        res.status(200).json(chatPartners)
    } catch (error) {
        console.error('Error in getAllChats controller',error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getAllMessages = async(req,res) => {
    try {
    const loggedUserId = req.user._id
    const otherUserId = req.params.id

    const messages = await Message.find({
        $or: [
            {senderId:loggedUserId,receiverId:otherUserId},
            {senderId:otherUserId,receiverId:loggedUserId}
        ]
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
    } catch (error) {
        console.error('Error in getAllMessages controller',error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async(req,res) => {
    try {
        const {text,image} = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id
        if(!text?.trim() && !image) return res.status(400).json({message: "Text or Image is required"})
        if(!mongoose.Types.ObjectId.isValid(receiverId)) return res.status(400).json({message: "Invalid ReceiverId"})
        
        const receiverExists = await User.exists({_id: receiverId})
        if(!receiverExists) return res.status(404).json({message: "Receiver Doesnt exist"})

        if(senderId.equals(receiverId)) return res.status(400).json({message: "You can't send message to yourself"})

        let imageUrl
        if(image){
        const cloudUpload = await cloudinary.uploader.upload(image, {
            resource_type: "image",
            folder: "chat_images",       // organise in Cloudinary
            transformation: [{ quality: "auto", fetch_format: "auto" }], // optimise
        });
            imageUrl = cloudUpload.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text?.trim(),
            image: imageUrl
        })
        await newMessage.save()

        const receiverSocketId = onlineUsers[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.error('Error in sendMessage controller',error)
        return res.status(500).json({message: "Internal Server Error"})
    }
} 

