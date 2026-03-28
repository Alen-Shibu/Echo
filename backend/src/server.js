import express from 'express'
import "dotenv/config"
import cookieParser from 'cookie-parser'

import {connectDB} from './lib/db.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'

const PORT = process.env.PORT || 5000
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser())
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.get('/',(_,res)=>{
    res.send("Server is running")
})

const startServer = async() => {
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`App is Running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log('Failed to Start Server:',error.message)
        process.exit(1)
    }
}

startServer();