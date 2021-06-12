const path = require("path")
const busboy = require('connect-busboy');
const fs = require("fs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const {
	v4: uuidv4
} = require('uuid');
const {
	domain,
	secret
} = require("../config")

class UserDataController {
	async uploadProfileImage(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1]
			console.log("загрузка изображения")
			const id = jwt.verify(token, secret).id;
			var fstream;
			const imageName = uuidv4() + ".png";
			req.pipe(req.busboy);
			req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) {
				console.log(key, value);
			});
			req.busboy.on('file', function (fieldname, file, filename) {
				console.log("Uploading: " + filename);
				var saveTo = path.join("./public/uploads/profiles", imageName);
				console.log('Uploading: ' + saveTo);
				file.pipe(fs.createWriteStream(saveTo));
			});
			req.busboy.on('finish', function () {
				console.log('Upload complete');
			});

			const user = await User.findOne({
				_id: id
			})


			await User.updateOne({
				_id: id
			}, {
				$set: {
					// "username" :  user.username, 
					// "userInfo": user.userInfo,
					"userPhoto": "http://" + domain + "/static/uploads/profiles/" + imageName,
				}
			})

			return res.status(200).json({
				message: "Success"
			});

			// console.log("Запрос дошел")
			// console.log(req.body)
			// const token = req.headers.authorization.split(' ')[1]


			// const {
			// 	url
			// } = req.body;

			// console.log("User Id:", id);
			// // const {} = req.body


			// console.log("Данные обновлены")

		} catch (e) {
			console.log(e)
			res.status(500).json({
				message: 'Internal server error'
			})
		}
	}

	async updateUserData(req, res) {
		try {

			const token = req.headers.authorization.split(' ')[1]

			const id = jwt.verify(token, secret).id;

			const {
				gender,
				age,
				aboutUser,
				height,
				hairColor,
				eyesColor,
				username,
				instagramProfile,
				facebookProfile,
				vkProfile
			} = req.body;

			console.log("User Id:", id);
			// const {} = req.body
			console.log(req.body)

			const user = await User.findOne({
				_id: id
			})

			await User.updateOne({
				_id: id
			}, {
				$set: {
					"gender": gender,
					"age": age,
					"eyesColor": eyesColor,
					"hairColor": hairColor,
					"height": height,
					"gender": gender,
					"aboutUser": aboutUser,
					"instagramProfile": instagramProfile,
					"facebookProfile": facebookProfile,
					"vkProfile": vkProfile
				}
			})

			console.log("Данные обновлены")
			return res.status(200).json({
				message: "Success"
			});
		} catch (e) {
			console.log(e)
			res.status(500).json({
				message: 'Internal server error'
			})
		}
	}
}


module.exports = new UserDataController();