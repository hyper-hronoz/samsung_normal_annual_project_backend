const User = require("../models/User")
const bcrypt = require("bcryptjs")

class AuthController {
    async registration(req, res) {
        try {
            console.log(req.body)
            const {username, password} = req.body;
            console.log(username, password)
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({username: username, password: hashPassword, gender: "M"})
            await user.save()
            return res.json({message: "Пользователь успешно зарегистрирован"})
        }
        catch (error) {
            console.error(error);
            res.status(400).json({message: "auth failed internal server error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            res.status(200).json({message: "login successful"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
}

module.exports = new AuthController();