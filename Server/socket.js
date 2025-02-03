import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const sendmessage = async (message) => {
    const recipientSocketId = userSocketMap.get(message.recipient);
    const senderSocketId = userSocketMap.get(message.sender);
    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "_id userName lastName email image color")
      .populate("recipient", "userName lastName email image color");
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receivedmessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receivedmessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id: ${socket.id}`);
    } else {
      console.log("userId de de bhai ");
    }
    socket.on("disconnect", () => disconnect(socket));
    socket.on("sendmessage", (message) => {
      sendmessage(message);
    });
  });
};

export default setupSocket;
