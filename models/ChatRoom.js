const {Schema, model} = require("mongoose");

const ChatRoom = new Schema({
    users: {type: Array, required: true},
    isGroup: {type: Boolean, required: true}
})

module.exports = model("ChatRoom", ChatRoom);