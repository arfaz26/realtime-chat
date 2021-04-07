const express = require("express");
const socketio = require("socket.io");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});

//initialize socket for the server
const io = socketio(server);
let connectedUsers = 0;
io.on("connection", (socket) => {
  console.log("New user connected");
  connectedUsers += 1;

  io.sockets.emit("user-updated", connectedUsers);

  //   io.sockets.emit("receive_message", {
  //     message: data.message,
  //     username: socket.username,
  //   });

  socket.broadcast.emit("new-user");

  socket.username = "Anonymous";

  socket.on("change_username", (data) => {
    socket.username = data.username;
  });

  socket.on("disconnect", (data) => {
    connectedUsers -= 1;
    io.sockets.emit("user-updated", connectedUsers);
  });

  socket.on("new_message", (data) => {
    console.log("new message");
    io.sockets.emit("receive_message", {
      message: data.message,
      username: socket.username,
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", { username: socket.username });
  });
});

// io.on('dis')
