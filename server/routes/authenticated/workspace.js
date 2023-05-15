const router = require('express').Router()
const workspaceController = require('../../controllers/WorkspaceController')
const { adminToken, verifyToken } = require('../../middleware/verifyToken')

router.post('/', adminToken, workspaceController.add)

router.get('/', verifyToken, workspaceController.list)

router.get('/id/:id', adminToken, workspaceController.listByWorkspaceId)

router.put('/:id', adminToken, workspaceController.edit)

router.delete('/:id', adminToken, workspaceController.delete)

router.post('/search', verifyToken, workspaceController.search)

router.post('/items/search', verifyToken, workspaceController.searchItemsInWorkspace)

router.get('/projects', adminToken, workspaceController.listWorkspaceWithProject)

module.exports = router