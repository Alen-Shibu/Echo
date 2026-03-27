import express from 'express'
import { register, login, logout, updateProfile, updateUserName, updatePassword } from '../controllers/auth.controllers.js'
import {protectRoute} from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)

router.put('/update-profile',protectRoute,updateProfile)
router.put('/update-username',protectRoute,updateUserName)
router.put('/update-password',protectRoute,updatePassword)

router.get('/check',protectRoute,(req,res)=>{
    res.status(200).json(req.user)
})

export default router