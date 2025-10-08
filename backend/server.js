const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

const { PORT, FRONTEND_URL } = require("./config/dotenv.config");
const dbConnect = require("./config/dbConnect");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.get("/", (req, res) => {
  res.send("HackathonBuddy backend running ✅");
});

server.listen(PORT, () => {
  dbConnect();
  console.log(`🚀 Server running on port ${PORT}`);
});
