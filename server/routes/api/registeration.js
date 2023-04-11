const router = require('express').Router()
const signUpController = require('../../controllers/SignUpController')

router.get('/', signUpController.register)

router.post('/signup', signUpController.signUp)

router.get('/user', signUpController.findUserByEmail)

router.get('/company', signUpController.findCompanyByEmail)

module.exports = router