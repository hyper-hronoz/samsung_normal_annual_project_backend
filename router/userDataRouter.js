const router = require("express").Router();
const controller = require("../controllers/userDataController")
const authMiddlewaree = require("../middlewaree/authMiddlewaree")

router.post("/upload-image", authMiddlewaree, controller.uploadProfileImage)
router.put("/user", authMiddlewaree, controller.updateUserData)
router.get("/user", authMiddlewaree, controller.getCurrentUserData)


module.exports = router