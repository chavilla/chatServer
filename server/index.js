const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const router = require("./router");

const app = express();
const port = process.env.PORT || 4000;
app.use(router);

// Create a new server with express
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  // ...
  socket.on('disconnect', ()=>{
    console.log('User had left');
  });
});

server.listen(port, () => console.log(`Server started on port ${port}`));
