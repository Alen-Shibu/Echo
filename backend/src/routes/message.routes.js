import express from 'express'
import {protectRoute} from '../middlewares/auth.middleware.js'
import { getAllContacts, getAllMessages, sendMessage , getAllChats} from '../controllers/message.controllers.js'

const router = express.Router()

router.use(protectRoute)

router.get('/contacts',getAllContacts)
router.get('/chats',getAllChats)
router.get('/:id',getAllMessages)
router.post('/send/:id',sendMessage)

export default router