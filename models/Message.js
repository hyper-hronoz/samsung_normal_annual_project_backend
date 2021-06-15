const {Schema, model} = require("mongoose");

const Message = new Schema({
    text: {type: String, required: true},
    username: {type: String, required: true},
    date: {type: String, required: true}
})

module.exports = model("Message", Message);