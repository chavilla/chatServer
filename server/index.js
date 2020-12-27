const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const router = require("./router");
const port = process.env.PORT || 4000;
const { addUsers, getUser, getUsersInRoom, removeUser } = require("./users");

// Create a new server with express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// when the chat is started
io.on("connection", (socket) => {
  
  // When the user is joinned
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUsers({ id: socket.id, name, room });

    if (error) return callback(error);

    // Emit a message to the user who is joinig
    socket.emit("message", {
      user: "Admin",
      text: `Welcome to the room ${user.room}`,
    });
    
    // notificate to all users inside the room
    socket
      .broadcast()
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!!!` });

    //the new user joins to the room
    socket.join(user.room);

    callback();

  });

  //when an user sends to message
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message } );

    callback();  
  });

  // when the chat is disconnect
  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

app.use(router);
server.listen(port, () => console.log(`Server started on port ${port}`));
