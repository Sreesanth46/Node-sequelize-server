const router = require('express').Router()
const loginController = require('../../controllers/LoginController')

router.post('/', loginController.login)

router.post('/verifyToken', loginController.verifyToken)

module.exports = router