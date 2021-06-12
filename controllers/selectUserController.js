const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const ObjectID = require('mongodb').ObjectID;

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

        const currentUserId = new ObjectID(currentUser._id);

        console.log("id: ", currentUserId)

        async function findRandomUser() {
            const userLength = await User.countDocuments();

            console.log("Documnet length", userLength);

            let randomUser = await User.aggregate(
                [
                    {
                        $match: {
                            "_id" : {$nin: [currentUserId]}
                        }
                    },
                    {
                        $sample: {
                            size: 1
                        },
                    },
                    {
                        $unset: ["password"]
                    }
                ]
            );

            if (randomUser.length) {
                console.log(randomUser)
                res.status(200).json(randomUser[0])
            } else {
                console.log("it works")
                res.status(500).json({message: "Internal server erorr"})
            }
      
        }

        findRandomUser();
    }
}

module.exports = new SelectUserController();