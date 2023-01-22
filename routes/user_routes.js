const Router = require('express');
const userController = require('../controller/user_controller.js')
const router = new Router()




router.get('/user/:id', userController.getUserById)
router.get('/user/:id/opinions', userController.getOpinionsByUserId)
router.get('/user/chats/:id', userController.getChatsByUserId)
router.post('/user/create-chat', userController.createUserChat)
router.post('/user/opinion', userController.createOpinionByUserId)
router.put('/user/opinion', userController.updateOpinionByUserId)
router.delete('/user/opinion/:id', userController.deleteOpinionsById)




module.exports = router