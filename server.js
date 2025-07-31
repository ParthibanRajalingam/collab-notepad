const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let sharedNote = ""; // In-memory note

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send current note to new user
  socket.emit("loadText", sharedNote);

  // Receive text update from a client
  socket.on("textUpdate", (newText) => {
    sharedNote = newText;
    socket.broadcast.emit("textUpdate", newText);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
