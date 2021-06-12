const router = require("express").Router();
const controller = require("../controllers/selectUserController")
const authMiddlewaree = require("../middlewaree/authMiddlewaree")

router.get("/user", authMiddlewaree, controller.getRandomUser)
// router.post("/upload", authMiddlewaree, controller.upload)

module.exports = router