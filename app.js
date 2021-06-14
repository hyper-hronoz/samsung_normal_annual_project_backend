const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const User = require("./models/User")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const busboy = require("connect-busboy")
const path = require("path")
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


// let users = ['cat', "dog", "duck", "dragon"]

// let rooms = [{
//     name: "abracadabra",
//     users: [users[0], users[1]],
//     messages: [{
//         message_from: users[0],
//         message_data: "hello it is message"
//       },
//       {
//         message_from: users[1],
//         message_data: "hello it is message from user 2"
//       }
//     ]
//   },
//   {
//     name: "otherrrrrr room",
//     users: [users[0], users[3]],
//     messages: [{
//         message_from: users[0],
//         message_data: "hello it is message from other room"
//       },
//       {
//         message_from: users[2],
//         message_data: "hello it is message from user 2 from other room"
//       }
//     ]
//   },
//   {
//     name: "other room",
//     users: [users[0], users[2]],
//     messages: [{
//         message_from: users[0],
//         message_data: "hello it is message from other room"
//       },
//       {
//         message_from: users[2],
//         message_data: "hello it is message from user 2 from other room"
//       }
//     ]
//   }
// ]

// io.on("connection", socket => {
//   console.log("works");

//   // socket.on('message', (room, message) => {
//   //   socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
//   // })

//   socket.on("begin-chat", (data) => {
//     for (let i of rooms) {
//       if (i.users.includes(data.userTo) && i.users.includes(data.userFrom)) {
//         socket.name = i.name
//         socket.join(i.name);
//       }
//     }
//   })

//   socket.on("message", (data) => {
//     // console.log("I recived a message");
//     // console.log("Hello if fount users", i.name);
//     console.log(data["message"]);
//     console.log(socket.name);
//     socket.to(socket.name).emit("message", data["message"])
//   })

//   // socket.on("create-chat", (userFrom, userTo) => {
//   //   if (!(users.includes(userTo) && users.includes(userFrom))) {
//   //       return;
//   //   }
//   //   for (let i of rooms) {
//   //     if (i.users.includes(userFrom) && i.users.includes(userTo)) {
//   //       socket.join(i.name);
//   //       return;
//   //     }
//   //   }


//   // })

// });

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
// var wss = new WebSocketServer({server: server});

// wss.on('open', function open() {
//   ws.send('something');
// });