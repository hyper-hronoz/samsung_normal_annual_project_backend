const router = require("express").Router();
const controller = require("../../controllers/authController")
const authMiddlewaree = require("../../middlewaree/authMiddlewaree")

router.post("/registration", controller.registration)
router.post("/login", controller.login)
router.post("validateToken", authMiddlewaree, controller.validateToken)

router.get("/user", authMiddlewaree, controller.getUserData)
router.put("/user", authMiddlewaree, controller.updateUserData)
router.post("/upload", authMiddlewaree, controller.upload)

module.exports = router