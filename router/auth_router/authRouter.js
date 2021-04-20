const router = require("express").Router();
const controller = require("../../controllers/authController")
const authMiddlewaree = require("../../middlewaree/authMiddlewaree")

router.post("/registration", controller.registration)
router.post("/login", controller.login)

module.exports = router