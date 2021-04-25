const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
    secret
} = require('../config')

class UserActionController {
    async like(req, res) {
        console.log("Добавляем лайк")
        // console.log(req.body)
        const token = req.headers.authorization.split(' ')[1]

        const id = jwt.verify(token, secret).id;

        const user = await User.findOne({
            _id: id
        })

        const {username } = req.body;

        const likedUser= await User.findOne({
            username: username
        })

        if (likedUser) {
            await User.updateOne({
                    _id: id
                }, {
                    $push: {
                        "userLiked": likedUser.username
                    }
            })
            res.status(200).json({success: "success" })
        } else {
            res.status(400).json({message: "такой пользователь не найден"})
        }

    }
}

module.exports = new UserActionController();