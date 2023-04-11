const router = require('express').Router();

router.use('/login', require('./api/login'))

router.use('/register', require('./api/registeration'))

router.use('/workspace', require('./authenticated/workspace'))

router.use('/project', require('./authenticated/project'))

router.use('/profile', require('./authenticated/profile'))

module.exports = router