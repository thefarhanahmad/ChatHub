// importing instances to use it
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const app = express();

// creating socket server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

var onlineUsers = 0;
// socket connecting
io.on("connection", (socket) => {
  // console.log(`new user joioned ${socket.id}`);

  // show how many users are joined
  onlineUsers++;
  io.sockets.emit("online-users", { msg: `${onlineUsers} Users Joined` });

  // broadcast a message to all users when a new user joins the chat
  socket.on("user-joined", (user) => {
    // console.log("user joined:",user)
    socket.broadcast.emit("joined-msg", {
      message: `${user} joined the chat`,
    });
  });

  // fetch message from client and send again to users
  socket.on("send", (message) => {
    // console.log(message);
    io.sockets.emit("receive", message);
  });

  // socket disconnecting
  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);
    // console.log(users)
    onlineUsers--;
    io.sockets.emit("online-users", onlineUsers);
  });
});

// server listening on port
const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
