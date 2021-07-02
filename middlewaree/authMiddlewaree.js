const jwt = require('jsonwebtoken')
const {secret} = require('../config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        console.log("проходим авторизацию")
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        if (!token) {
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        console.log("пользователь авторизовался")
        next()
    } catch (e) {
        console.error("Error passing authentication", e)
        return res.status(401).json({message: "Пользователь не авторизован"})
    }
};