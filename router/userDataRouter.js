const router = require("express").Router();
const controller = require("../controllers/userDataController")
const authMiddlewaree = require("../middlewaree/authMiddlewaree")

router.post("/upload-image", authMiddlewaree, controller.uploadProfileImage)

module.exports = router