import express from 'express'
import "dotenv/config"
import cookieParser from 'cookie-parser'
import cors from "cors";
import http from "http"
import {Server} from "socket.io"

import {connectDB} from './lib/db.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'

const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app)

// ---- Socket.IO setup ----
const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173", process.env.FRONTEND_URL],
        credentials: true
    }
})

// Map to track online users: { userId -> socketId }
const onlineUsers = {}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId

  if (userId) {
    onlineUsers[userId] = socket.id
    io.emit("onlineUsers", Object.keys(onlineUsers))  // broadcast to all
  }

  // Typing indicator
  socket.on("typing", ({ to }) => {
    const receiverSocketId = onlineUsers[to]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from: userId })
    }
  })

  socket.on("stopTyping", ({ to }) => {
    const receiverSocketId = onlineUsers[to]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { from: userId })
    }
  })

  socket.on("disconnect", () => {
    delete onlineUsers[userId]
    io.emit("onlineUsers", Object.keys(onlineUsers))  // broadcast updated list
  })
})

// Export io so controllers can use it
export { io, onlineUsers }

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser())
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
   process.env.FRONTEND_URL
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.get('/',(_,res)=>{
    res.send("Server is running")
})

const startServer = async() => {
    try {
        await connectDB();
        server.listen(PORT,()=>{
            console.log(`App is Running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log('Failed to Start Server:',error.message)
        process.exit(1)
    }
}

startServer();