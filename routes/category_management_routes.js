const Router = require('express')
const categoryManagementController = require('../controller/category_management_controller.js')
const router = new Router()
const authMiddleware = require('../middlewares/auth_middleware')


router.get('/categories', categoryManagementController.getCategories)
router.post('/category', categoryManagementController.createCategory)
router.put('/category', categoryManagementController.updateCategory)
router.delete('/category/:id', categoryManagementController.deleteCategory)
router.get('/attributes', categoryManagementController.getAttributes)
router.post('/attribute', categoryManagementController.createAttribute)
router.put('/attribute', categoryManagementController.updateAttribute)
router.delete('/attribute/:id', categoryManagementController.deleteAttribute)





module.exports = router