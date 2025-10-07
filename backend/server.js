import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// --- In-memory store (replace later with DB)
const rooms = {};

io.on("connection", (socket) => {
  const { roomId } = socket.handshake.query;
  if (!roomId) return;

  socket.join(roomId);
  if (!rooms[roomId]) rooms[roomId] = [];

  console.log(`User connected to room: ${roomId}`);

  // Send chat history
  socket.emit("chat:history", rooms[roomId]);

  // Handle message send
  socket.on("chat:send", (msg) => {
    const message = { ...msg, ts: Date.now() };
    rooms[roomId].push(message);
    io.to(roomId).emit("chat:new", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("HackathonBuddy backend running ✅");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
