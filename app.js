const express = require("express");
const mongoose = require("mongoose");
const PORT = 3000;
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const User = require("./models/User")
const bcrypt = require("bcryptjs")

const { secret } = require('./config')
const app = express();
 
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routes
const messagesRouter = require("./router/messages_router/messagesRouter")
const authRouter = require("./router/auth_router/authRouter");
const selecUsersRouter = require("./router/select_users/selectUsers");
const authMiddlewaree = require("./middlewaree/authMiddlewaree");
const selectUserController = require("./controllers/selectUserController");

app.use("/messages", messagesRouter)
app.use("/auth", authRouter)
app.use("/find", selecUsersRouter)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://Vlad:hellosjdfksladfj@cluster0.4feya.mongodb.net/auth?retryWrites=true&w=majority`);
        app.listen(PORT, "192.168.0.15", () => {
            console.log("server is working on port " + PORT);
        })
    } catch (e) {
        console.log(e);
    }
}

start();
