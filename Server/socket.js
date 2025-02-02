import { Server as SocketIOServer } from "socket.io";
const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
};

const usrerSocketMap = new Map();
4;

const disconnect = (socket) => {
  console.log(`Client Disconnected: ${socket.id}`);
  for (const [userId, socketId] of usrerSocketMap.entries()) {
    if (socketId === socket.id) {
      usrerSocketMap.delete(userId);
      break;
    }
  }
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    usrerSocketMap.set(userId, socket._id);
    console.log(`User connected: ${userId} with socket id: ${socket.id}`);
  } else {
    console.log("userId de de bhai ");
  }
  socket.on("disconnect", () => disconnect(socket));
});

export default setupSocket;
