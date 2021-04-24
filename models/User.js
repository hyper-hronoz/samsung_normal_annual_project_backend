const {Schema, model} = require("mongoose");

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userPhoto: {type: String, required: false},
    userInfo: {
        gender: {type: String, required: true},
        age: {type: String, require: false},
        hairColor: {type: String, required: false},
        eyesColor: {type: String, required: false},
        height: {type: String, required: false},
        aboutUser: {type: String, required: false},
    },
})

module.exports = model("User", User);