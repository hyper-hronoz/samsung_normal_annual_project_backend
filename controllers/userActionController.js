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

        // console.log(username, user);

        console.log(user["likedArray"].includes("hello"))
        
        
        let newArray = user["userLiked"].push(Math.random() * 1000)
        
        console.log(newArray);

        await User.updateOne({
                _id: id
            }, {
                $set: {
                    "username" :  user.username, 
                    "userInfo": user.userInfo,
                    "userPhoto": user.url,
                    "userLiked": newArray
                }
        })


        res.status(200).json({message: "success" })
    }
}

module.exports = new UserActionController();