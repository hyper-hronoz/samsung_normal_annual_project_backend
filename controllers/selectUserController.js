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

        const currentUser = await User.findOne({
            _id: id
        })

        async function findRandomUser() {
            const userLength = await User.countDocuments();

            console.log("Documnet length", userLength);

            let randomUser = await User.aggregate([
                { $sample: { size: 1}, 
            }, {$unset: ["_id", "password"]}]);

            randomUser = randomUser[0]

            console.log(randomUser.username, currentUser.username)

            if (userLength >= 2) {
                if (randomUser.username != currentUser.username) {
                    res.status(200).json(randomUser)
                } else {
                    findRandomUser();
                }
            } else {
                res.status(500).json({message: "Кандидатов нет"})
                return
            }
        }

        findRandomUser();
    }
}

module.exports = new SelectUserController();