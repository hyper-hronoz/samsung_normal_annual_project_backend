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
const Message = require("./models/Message")
const moment = require('moment');
ObjectId = require('mongodb').ObjectID;
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

const {
  domain,
  secret,
  PORT
} = require('./config')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

const messagesRouter = require("./router/messagesRouter");
const authRouter = require("./router/authRouter");
const selectUsersRouter = require("./router/selectUsersRouter");
const actionUsersRouter = require("./router/userActionRouter");
const userDataRouter = require("./router/userDataRouter");
const authMiddlewaree = require("./middlewaree/authMiddlewaree");

app.get("/", (req, res) => {
  res.send("Сейчас ресурс находится на технических работах, зайдите посже пожалуйста, я пока 02.07 посижу часик - 2")
})

app.use(busboy());

app.use("/messages", messagesRouter)
app.use("/auth", authRouter)
app.use("/find", selectUsersRouter)
app.use("/action", actionUsersRouter)
app.use("/user-data", userDataRouter)


io.on("connection", socket => {
  console.log("works");

  // socket.on("begin-chat", async (data) => {
  //   data = await JSON.parse(data)

  //   const currentUserId = await jwt.verify(data["jwt"], secret).id

  //   const chatterId = data.id;

  //   const chatRoom = await ChatRoom.findOne({
  //     "users": {
  //       $all: [currentUserId, chatterId],
  //     },
  //   })

  //   const users = []

  //   if (chatRoom) {
  //     socket.join(toString(socket.name));

  //     socket.name = chatRoom._id;

  //     console.log("Joining to room", socket.name);


  //     const user1 = await User.findOne({
  //       "_id": mongoose.Types.ObjectId(chatRoom.users[0])
  //     })

  //     if (user1) {
  //       users.push({
  //         _id: chatRoom.users[0],
  //         username: user1.username
  //       })
  //     }

  //     const user2 = await User.findOne({
  //       "_id": mongoose.Types.ObjectId(chatRoom.users[1])
  //     })

  //     if (user2) {
  //       users.push({
  //         _id: chatRoom.users[1],
  //         username: user2.username
  //       })
  //     }

  //     socket.users = users
  //   }
  // })

  socket.on("get-previous-messages", async (data) => {
    data = JSON.parse(data)
    console.log(data);
    let paginationNumber = await data.pagination;
    let messagesWrote = await data.messagesWrote

    const currentUserId = await jwt.verify(data["jwt"], secret).id

    const chatterId = await data.id;

    const chatRoom = await ChatRoom.findOne({
      "users": {
        $all: [currentUserId, chatterId],
      },
    })

    let chatRoomId = await mongoose.Types.ObjectId(chatRoom.id).toString()

    await socket.join(chatRoomId);

    console.log(chatRoom._id);
    if (chatRoom) {
      const messages = await ChatRoom.aggregate([{
          $match: {
            "_id": ObjectId(chatRoomId) 
          }
        },
        {
          $project: {
            array: {
              $slice: ["$messages", 0, 1000]
            }
          }
        }
      ])

      for (let i = 0; i < messages[0].array.length; i++) {
        console.log(messages[0].array[i]);
        if (messages[0].array[i].userFrom == currentUserId) {
          messages[0].array[i]["isUsers"] = true;
        } else {
          messages[0].array[i]["isUsers"] = false;
        }
      }

      console.log(messages[0].array);
      await socket.emit("get-previous-messages", messages[0].array)
    }
  })

  socket.on("message", async (data) => {
    try {
      data = await JSON.parse(data)

      const currentUserId = await jwt.verify(data["jwt"], secret).id

      const chatterId = data.id;

      const chatRoom = await ChatRoom.findOne({
        "users": {
          $all: [currentUserId, chatterId],
        },
      })


      if (chatRoom) {
        let chatRoomId = mongoose.Types.ObjectId(chatRoom.id).toString();
        console.log("Gettin messages");
        console.log(socket.rooms);

        const users = []

        const user1 = await User.findOne({
          "_id": mongoose.Types.ObjectId(chatRoom.users[0])
        })

        if (user1) {
          users.push({
            _id: chatRoom.users[0],
            username: user1.username
          })
        }

        const user2 = await User.findOne({
          "_id": mongoose.Types.ObjectId(chatRoom.users[1])
        })

        if (user2) {
          users.push({
            _id: chatRoom.users[1],
            username: user2.username
          })
        }

        let username = "";

        for (let i of users) {
          if (i._id != data.userId) {
            username = i.username;
            break;
          }
        }

        let send = {}

        if (data.image) {
          send = {
            username: username,
            image: data.image
          }
        } else if (data.message.trim() == "") {
          return socket.emit("error", "message is empty")
        } else if (data.message) {
          send = {
            username: username,
            message: data.message
          }
        }

        console.log(send);


        if (data.image) {
          console.log("on image", chatRoom._id);

          await ChatRoom.updateOne({
            "_id": ObjectId(chatRoomId)
          }, {
            $addToSet: {
              "messages": {
                username: username,
                userFrom: currentUserId,
                image: data.image,
                date: moment().format()
              }
            }
          })
        } else if (data.message) {
          console.log("on message", chatRoom._id);
          console.log(mongoose.Types.ObjectId(chatRoomId));

          await ChatRoom.updateOne({
            "_id": ObjectId(chatRoomId)
          }, {
            $addToSet: {
              "messages": {
                username: username,
                userFrom: currentUserId,
                message: data.message,
                date: moment().format()
              }
            }
          })
        }

        console.log(send);

        socket.to(chatRoomId).emit("message", send)
      }
    } catch (e) {
      console.error(e);
    }
  })
})

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Vlad:hellosjdfksladfj@cluster0.4feya.mongodb.net/auth?retryWrites=true&w=majority`);
    httpServer.listen(PORT, () => {
      console.log("server is working on port " + PORT);
    })

  } catch (e) {
    console.log(e);
  }
}

start();