const mongoose = require("mongoose")
const ChatRoom = require("../models/ChatRoom")
const jwt = require("jsonwebtoken")

const {
    secret
} = require('../config')

class MessangerController {
	async createChatRoom(req, res) {

		const token = req.headers.authorization.split(' ')[1]

		const currentUserId = jwt.verify(token, secret).id

		const nominationUserId = req.body._id;

		const chatRoom = await new ChatRoom({
			users: [currentUserId, nominationUserId],
			isGroup: false
		 })

		await chatRoom.save();

	}
}

module.exports = new MessangerController();