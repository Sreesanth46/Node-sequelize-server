const router = require('express').Router()
const loginController = require('../../controllers/loginController')

router.get('/', (req, res) => {
    res.send("Login page GET request").status(200)
})

// router.post('/', loginController.register)

module.exports = router