const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const User = require("./models/User")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const busboy = require("connect-busboy")
const path = require("path")

const {
  domain,
  secret,
  PORT
} = require('./config')
const app = express();


app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// routes
const messagesRouter = require("./router/messagesRouter");
const authRouter = require("./router/authRouter");
const selecUsersRouter = require("./router/selectUsers");
const actionUsersRouter = require("./router/userActionRouter");
const userDataRouter = require("./router/userDataRouter");

const userDataController = require("./controllers/userDataController");
const selectUserController = require("./controllers/selectUserController");

const authMiddlewaree = require("./middlewaree/authMiddlewaree");

const {
  pathToFileURL
} = require("url");

app.use(busboy()); 
app.use("/messages", messagesRouter)
app.use("/auth", authRouter)
app.use("/find", selecUsersRouter)
app.use("/action", actionUsersRouter)
app.use("/user-data", userDataRouter)

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Vlad:hellosjdfksladfj@cluster0.4feya.mongodb.net/auth?retryWrites=true&w=majority`);
    app.listen(PORT, domain, () => {
      console.log("server is working on port " + PORT);
    })
  } catch (e) {
    console.log(e);
  }
}

start();