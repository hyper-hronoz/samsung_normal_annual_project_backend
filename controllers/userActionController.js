const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
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
                    $addToSet: {
                        "userLiked": likedUser.username
                    }
            })
            res.status(200).json({success: "success" })
        } else {
            res.status(400).json({message: "такой пользователь не найден"})
        }
    }

    async getLikedUsers(req, res) {
        const token = req.headers.authorization.split(' ')[1]

        const id = jwt.verify(token, secret).id;

        let user = await User.aggregate( [ {$match: {_id: ObjectId(id)}},{ $unset: ["_id", "password"] }] )

        user = user[0]

        console.log(user)

        const likedUsers = await User.find({"username": {"$in" : user.userLiked}})

        console.log(likedUsers)

        res.status(200).json({registeredUsers : likedUsers})

    }
}

module.exports = new UserActionController();