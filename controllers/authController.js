const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
    secret
} = require('../config')

const generateAccessToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, secret, {
        expiresIn: "30m"
    })
}

class AuthController {
    async registration(req, res) {
        try {
            console.log(req.body)
            const {
                username,
                password,
                gender
            } = req.body;
            console.log(username, password)
            const candidate = await User.findOne({
                username
            })
            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует"
                })
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({
                username: username,
                password: hashPassword,
                userInfo: {
                    gender: gender
                }
            })
            await user.save()
            return res.json({
                message: "Пользователь успешно зарегистрирован"
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
                username,
                password
            } = req.body
            const user = await User.findOne({
                username
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

            const candidate = await User.findOne({
                _id: id
            })

            console.log(candidate);

            return res.json({
                username: candidate.username,
                userInfo: candidate.userInfo,
                userPhoto: candidate.userPhoto
            })


        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    async updateUserData(req, res) {
        try {

            const token = req.headers.authorization.split(' ')[1]

            const id = jwt.verify(token, secret).id;

            const { userInfo, username } = req.body;

            console.log("User Id:", id);
            // const {} = req.body

            const user = await User.findOne({
                _id: id
            })

            const ifPropertyExists = (property) => {
                try {
                    return user[property] ? user[property] : userInfo[property]
                } catch (e) {
                    return None
                }
            }

            // отсеиваем null
            const createNewSet = () => {
                let info = {}

                for (let i in userInfo) {
                    if (ifPropertyExists(i)) {
                        info[i] = ifPropertyExists(i)
                    }
                }

                return info
            }

            await User.updateOne({
                _id: id
            }, {
                $set: {
                    "username" :  username, 
                    "userInfo": createNewSet()
                }
            })

            console.log("Данные обновлены")
            return res.status(200).json({message: "Success"});
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }

    async upload(req, res) {
        try {
            console.log("Запрос дошел")
            console.log(req.body)
            const token = req.headers.authorization.split(' ')[1]

            const id = jwt.verify(token, secret).id;

            const {url} = req.body;

            console.log("User Id:", id);
            // const {} = req.body

            const user = await User.findOne({
                _id: id
            })

            await User.updateOne({
                _id: id
            }, {
                $set: {
                    "username" :  user.username, 
                    "userInfo": user.userInfo,
                    "userPhoto": url,
                }
            })

            console.log("Данные обновлены")
            return res.status(200).json({message: "Success"});
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