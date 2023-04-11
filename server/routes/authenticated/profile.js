const router = require('express').Router();
const { verifyToken } = require('../../middleware/verifyToken');
const profileController = require('../../controllers/ProfileController')

router.get('/', verifyToken, profileController.list)

router.put('/', verifyToken, profileController.update)

router.put('/password', verifyToken, profileController.changePassword)

module.exports = router