const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

// routes
const messagesRouter = require("./router/messages_router/messagesRouter")
const authController = require("./router/auth_router/authRouter")

const app = express();

app.use("/messages", messagesRouter)
app.use("/auth", authController)

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${'hyper'}:${'W3oUwzriE8aFZOd9'}@cluster0.xxglm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
        app.listen(PORT, () => {
            console.log("server is working on port " + PORT);
        })
    } catch (e) {
        console.log(e);
    }
}

start();

