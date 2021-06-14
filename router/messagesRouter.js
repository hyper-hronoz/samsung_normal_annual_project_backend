const router = require("express").Router();
const controller = require("../controllers/messangerController")
const authMiddlewaree = require("../middlewaree/authMiddlewaree")

router.post('/room', authMiddlewaree, controller.createChatRoom);

module.exports = router