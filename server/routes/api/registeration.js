const router = require('express').Router()
const registerationController = require('../../controllers/RegisterationController')

router.post('/', registerationController.register)

router.post('/signup', registerationController.signUp)

router.get('/user', registerationController.findUserByEmail)

router.get('/company', registerationController.findCompanyByEmail)

module.exports = router