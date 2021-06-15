const router = require("express").Router();
const controller = require("../controllers/messangerController")
const authMiddlewaree = require("../middlewaree/authMiddlewaree")

router.post('/room', authMiddlewaree, controller.createChatRoom);
router.get('/rooms', authMiddlewaree, controller.getUsersChatRooms);

module.exports = router