const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
    secret
} = require('../config')

class SelectUserController {
    async getRandomUser(req, res) {
        console.log("Выбираем рандомного пользователся")
        const token = req.headers.authorization.split(' ')[1]

        const id = jwt.verify(token, secret).id;

        let randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
        randomUser = randomUser[0]
        

        res.status(200).json({
            "username": randomUser.username,
            "userInfo": randomUser.userInfo,
            "userPhoto": randomUser.userPhoto,
        })
    }
}

module.exports = new SelectUserController();