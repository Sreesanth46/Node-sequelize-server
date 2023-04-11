const router = require('express').Router();

router.all('/', (req, res) => {
    res.send("Route path").status(200)
})

router.use('/login', require('./api/login'))
router.use('/register', require('./api/registeration'))

module.exports = router