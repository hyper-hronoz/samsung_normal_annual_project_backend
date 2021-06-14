const router = require("express").Router();
const controller = require("../controllers/notificationsController")

router.ws('/', controller.notification);

module.exports = router