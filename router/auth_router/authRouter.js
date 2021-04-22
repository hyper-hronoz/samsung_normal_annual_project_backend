const router = require("express").Router();
const controller = require("../../controllers/authController")
const authMiddlewaree = require("../../middlewaree/authMiddlewaree")

router.post("/registration", controller.registration)
router.post("/login", controller.login)

router.get("/user", authMiddlewaree, controller.getUserData)
router.put("/user", authMiddlewaree, controller.updateUserData)

module.exports = router