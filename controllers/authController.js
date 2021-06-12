const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

const {

    secret
} = require('../config')

const generateAccessToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, secret, {
        expiresIn: "2160h"
    })
}

class AuthController {
    async registration(req, res) {
        try {
            console.log(req.body)
            const {
                username,
                password,
                email
            } = req.body;
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({
                username: username,
                password: hashPassword,
                email: email
            })
            await user.save()
            const newUser = await User.findOne({
                username
            })
            const token = generateAccessToken(newUser._id)
            console.log(username, password, email)
            return res.status(200).json({
                token
            })
        } catch (error) {
            console.error(error);
            res.status(400).json({
                message: "auth failed internal server error"
            })
        }
    }

    async login(req, res) {
        try {
            const {
                email,
                password
            } = req.body
            const user = await User.findOne({
                email
            })
            if (!user) {
                return res.status(400).json({
                    message: `Пользователь ${username} не найден`
                })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({
                    message: `Введен неверный пароль`
                })
            }
            const token = generateAccessToken(user._id)
            console.log(token)
            return res.status(200).json({
                token
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({
                message: 'Login error'
            })
        }
    }

    async getUserData(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]

            console.log("Headertoken is:", token);
            const id = jwt.verify(token, secret).id

            console.log("User Id:", id);
            // const {} = req.body

            const candidate = await User.aggregate([{
                $match: {
                    "_id": ObjectId(id)
                }
            }, {
                $unset: ["_id", "password"]
            }])

            if (candidate == []) {
                return res.status(401).json("пользователь не найден")
            }
            console.log(candidate);

            return res.json(candidate[0])

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

  

    async validateToken(req, res) {
        return res.sendStatus(200)
    }
}

module.exports = new AuthController();