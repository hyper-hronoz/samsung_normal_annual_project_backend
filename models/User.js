const {Schema, model} = require("mongoose");

const User = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    username: {type: String, required: true},
    password: {type: String, required: true},
    userPhoto: {type: String, required: false},
    userLiked: {type: [], required: false},
    gender: {type: String},
    age: {type: Number, require: false},
    hairColor: {type: String, required: false},
    eyesColor: {type: String, required: false},
    height: {type: Number, required: false},
    about: {type: String, required: false},
    vkProfile: {type: String, required: false},
    facebookProfile: {type: String, required: false},
    instagramProfile: {type: String, required: false},
    notifications: {type: [], required: false},
    isOnline: {type: Boolean, required: false}
})

module.exports = model("User", User);