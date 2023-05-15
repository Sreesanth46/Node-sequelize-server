const router = require('express').Router()
const projectMemberController = require('../../controllers/ProjectMemberController')
const { adminToken, verifyToken } = require('../../middleware/verifyToken')

router.post('/', adminToken, projectMemberController.add)

router.get('/', adminToken, projectMemberController.list)

router.put('/', adminToken, projectMemberController.edit)

router.get('/projectid/:projectId', verifyToken, projectMemberController.listByProjectId)

router.delete('/:id', adminToken, projectMemberController.delete)

router.post('/filter/assigned/:projectId', adminToken, projectMemberController.filterAssignedUser)

router.post('/filter/unassigned/:projectId', adminToken, projectMemberController.filterUnassignedUser)

router.get('/department', adminToken, projectMemberController.listDepartments)

router.get('/workspace', adminToken, projectMemberController.listWorkspace)

router.post('/userid/:id', adminToken, projectMemberController.listByUserId)

router.post('/unassigned/project/:id', adminToken, projectMemberController.filterUnassiginedProjectByUserId)

router.post('/roles', verifyToken, projectMemberController.listMemberRoles)

module.exports = router