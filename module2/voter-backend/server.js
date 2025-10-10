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

  socket.on("verifiedVoter", (data) => {
    console.log("Verified voter event:", data);
    io.emit("verifiedVoter", {
      voterId: data.voterId,
      regionId: data.regionId
    });  // Broadcast voterId and regionId
  });

  socket.on("lockVoting", (data) => {
    console.log("Lock event:", data);
    io.emit("lockVoting", data);  // Broadcast lock event
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(6000, () => console.log("✅ Socket.IO server running on 5000"));