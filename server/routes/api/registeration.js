const router = require('express').Router()
const registerationController = require('../../controllers/RegisterationController')

router.post('/', registerationController.register)

router.post('/signup', registerationController.signUp)

router.get('/signup/verify', registerationController.verifyToken)

router.post('/user', registerationController.findUserByEmail)

router.post('/company', registerationController.findCompanyByEmail)

module.exports = router