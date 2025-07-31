const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const redis = new Redis("redis://default:ARcsAAIjcDFkNzk4YzQ3MTc0YTM0N2Q2OGJiMDU3YTRhY2FmMjg1NnAxMA@touching-impala-5932.upstash.io:6379"); // Defaults to localhost:6379

app.use(express.static("public"));

const NOTE_KEY = "shared:note";

io.on("connection", async (socket) => {
  console.log("User connected");

  // Load current state
  const currentText = await redis.get(NOTE_KEY) || "";
  socket.emit("loadText", currentText);

  socket.on("textUpdate", async (newText) => {
    await redis.set(NOTE_KEY, newText);
    socket.broadcast.emit("textUpdate", newText);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
