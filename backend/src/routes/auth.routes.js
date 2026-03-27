import express from 'express'
import { register, login, logout } from '../controllers/auth.controllers.js'
import {protectRoute} from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)

router.get('/check',protectRoute,(req,res)=>{
    res.status(200).json(req.user)
})

export default router