const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const User = require("./models/User")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const busboy = require("connect-busboy")
const path = require("path")
const ChatRoom = require("./models/ChatRoom")
// const WebSocketServer = require("ws").Server;
// const http = require("http");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    method: ["GET", "POST"]
  }
});
// const server = http.createServer(app);


const {
  domain,
  secret,
  PORT
} = require('./config')
// const expressWs = require('express-ws')(app);

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// routes
const messagesRouter = require("./router/messagesRouter");
const authRouter = require("./router/authRouter");
const selectUsersRouter = require("./router/selectUsersRouter");
const actionUsersRouter = require("./router/userActionRouter");
const userDataRouter = require("./router/userDataRouter");
// const userNotificationsRouter = require("./router/notificationsRouter")
const authMiddlewaree = require("./middlewaree/authMiddlewaree");

app.get("/", (req, res) => {
  res.send("hello it works")
})

app.use(busboy());

app.use("/messages", messagesRouter)
app.use("/auth", authRouter)
app.use("/find", selectUsersRouter)
app.use("/action", actionUsersRouter)
app.use("/user-data", userDataRouter)


io.on("connection", socket => {
  console.log("works");

  socket.on("begin-chat", async (data) => {
    data = JSON.parse(data)

    const currentUserId = jwt.verify(data["jwt"], secret).id

    const chatterId = data.id;

    const chatRoom = await ChatRoom.findOne({
      "users": {
        $all: [currentUserId, chatterId],
      },
    })

    console.log("Room id is:", chatRoom._id);

    const users = []

    if (chatRoom) {
      socket.name = socket.join(chatRoom._id);
      socket.room = socket.chatRoom

      const user1 = await User.findOne({
        "_id": mongoose.Types.ObjectId(chatRoom.users[0])
      })

      console.log(user1);
      if (user1) {
        users.push({
          _id: chatRoom.users[0],
          username: user1.username
        })
      }

      const user2 = await User.findOne({
        "_id": mongoose.Types.ObjectId(chatRoom.users[1])
      })

      console.log(user2);
      if (user2) {
        users.push({
          _id: chatRoom.users[1],
          username: user2.username
        })
      }

      if (users.length == 2) {
        socket.users = users
      }
    }
  })

  socket.on("message", (data) => {
    console.log(socket.room);
    console.log(data)
    for (let i of socket.users) {
      socket.to(socket.name).emit("message", message)
    }
  })

});

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Vlad:hellosjdfksladfj@cluster0.4feya.mongodb.net/auth?retryWrites=true&w=majority`);
    httpServer.listen(PORT, domain, () => {
      console.log("server is working on port " + PORT);
    })
  } catch (e) {
    console.log(e);
  }
}

start();