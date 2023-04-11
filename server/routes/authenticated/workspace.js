const router = require('express').Router()
const workspaceController = require('../../controllers/WorkspaceController')
const { verifyToken } = require('../../middleware/verifyToken')

router.post('/',verifyToken, workspaceController.add)

router.get('/',verifyToken, workspaceController.list)

module.exports = router