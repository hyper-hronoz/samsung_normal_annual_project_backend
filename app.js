const express = require("express");
const mongoose = require("mongoose");
const PORT = 3000;
const bodyParser = require('body-parser')
const app = express();
 
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routes
const messagesRouter = require("./router/messages_router/messagesRouter")
const authController = require("./router/auth_router/authRouter")

app.use("/messages", messagesRouter)
app.use("/auth", authController)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://hyper:W3oUwzriE8aFZOd9@cluster0.xxglm.mongodb.net/myfirstDatabase?retryWrites=true&w=majority`);
        app.listen(PORT, "192.168.0.15", () => {
            console.log("server is working on port " + PORT);
        })
    } catch (e) {
        console.log(e);
    }
}

start();

