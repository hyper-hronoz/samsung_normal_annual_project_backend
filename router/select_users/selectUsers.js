const router = require("express").Router();
const controller = require("../../controllers/selectUserController")
const authMiddlewaree = require("../../middlewaree/authMiddlewaree")

router.get("/user", authMiddlewaree, controller.getRandomUser)
// router.put("/user", authMiddlewaree, controller.updateUserData)
// router.post("/upload", authMiddlewaree, controller.upload)

module.exports = router