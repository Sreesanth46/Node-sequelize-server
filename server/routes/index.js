const router = require('express').Router();

router.all('/', (req, res) => {
    res.sed("Route path").status(200)
})

router.use('/login', require('./api/login'))

module.exports = router