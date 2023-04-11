const router = require('express').Router();
const { verifyToken } = require('../../middleware/verifyToken');
const projectController = require('../../controllers/ProjectController')

router.post('/', verifyToken, projectController.add)

router.get('/', verifyToken, projectController.list)

module.exports = router