const router = require('express').Router();
const { verifyToken } = require('../../middleware/verifyToken');
const notificationController = require('../../controllers/NotificationController');

router.get('/', verifyToken, notificationController.list)

module.exports = router