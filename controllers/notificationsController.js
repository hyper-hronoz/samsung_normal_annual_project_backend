class Notifications {
	notification(ws, req) {

		ws.send("hello pidorazi");

		ws.on("connect", () => {
			console.log("Connected to websocket");
		})

		ws.on('message', (msg) => {
			console.log(msg);
		});

		console.log('socket', req.testing);
	}
}


module.exports = new Notifications()