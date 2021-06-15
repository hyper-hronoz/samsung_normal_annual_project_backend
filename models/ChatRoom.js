const {Schema, model} = require("mongoose");

const ChatRoom = new Schema({
    users: {type: Array, required: true},
    messages: {type: Array, required: false},
    isGroup: {type: Boolean, required: true}
})

module.exports = model("ChatRoom", ChatRoom);