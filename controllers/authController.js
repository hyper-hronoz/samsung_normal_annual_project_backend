const User = require("../models/User")

class AuthController {
    async registration(req, res) {
        const user = await new User({username: "Vlad", password: "Hello Bald", gender: "M"});
        await user.save();
    }

    login(req, res) {

    }
}

module.exports = new AuthController();