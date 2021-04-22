const {Schema, model} = require("mongoose");

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userInfo: {
        gender: {type: String, required: true},
        hairColor: {type: String, required: false},
        eyesColor: {type: String, required: false},
        height: {type: Number, required: false},
        abountUser: {type: String, required: false}
    },
})

module.exports = model("User", User);