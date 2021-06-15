const mongoose = require("mongoose")
const ChatRoom = require("../models/ChatRoom")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const {
	secret
} = require('../config')

class MessangerController {
	async createChatRoom(req, res) {

		const token = req.headers.authorization.split(' ')[1]

		const currentUserId = jwt.verify(token, secret).id

		const nominationUserId = req.body._id;

		console.log(currentUserId, nominationUserId)

		const pretendentRooms = await ChatRoom.aggregate([{
			$match: {
				"users": {
					$all: [currentUserId, nominationUserId],
				},
			}
		}])

		if (!(pretendentRooms.length == 0)) {
			return res.status(409).json({
				message: "Room already exist"
			})
		}

		const chatRoom = await new ChatRoom({
			users: [currentUserId, nominationUserId],
			isGroup: false
		})

		await chatRoom.save();

		await res.status(200).json({
			message: "Room saccessfully created"
		})

	}

	async getUsersChatRooms(req, res) {

		const token = req.headers.authorization.split(' ')[1]

		const currentUserId = jwt.verify(token, secret).id


		const chatRooms = await ChatRoom.aggregate([{
			$match: {
				"users": {
					$elemMatch: {
						$eq: currentUserId
					},
				}
			},
		}])

		const contacts = []

		for (let i of chatRooms) {
			if (i.users[0] != currentUserId) {
				contacts.push(mongoose.Types.ObjectId(i.users[0]))
			}
			if (i.users[1] != currentUserId) {
				contacts.push(mongoose.Types.ObjectId(i.users[1]))
			}
		}

		const contactUsers = await User.aggregate(
			[
				{
					$match: {
						'_id': { $in: contacts }
					}
				},
				{
					$project: {
						"username": 1,
						"userPhoto" : 1,
					}
				}
			]
		);

		console.log(contactUsers);

		// chat rooms
		res.status(200).json(contactUsers)
	}
}

module.exports = new MessangerController();