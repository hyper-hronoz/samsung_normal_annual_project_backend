const router = require("express").Router();
const controller = require("../controllers/userActionController")
const authMiddlewaree = require("../middlewaree/authMiddlewaree")

router.post("/like", authMiddlewaree, controller.like)
router.get("/liked", authMiddlewaree, controller.getLikedUsers)
// router.put("/user", authMiddlewaree, controller.updateUserData)
// router.post("/upload", authMiddlewaree, controller.upload)

module.exports = router