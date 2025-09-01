const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("unlockVoting", (data) => {
    console.log("Unlock event:", data);
    io.emit("unlockVoting", data);  // broadcast to all clients
  });

  socket.on("lockVoting", (data) => {
    console.log("Lock event:", data);
    io.emit("lockVoting", data);    // broadcast again
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("✅ Socket.IO server running on 5000"));
