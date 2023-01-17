const Router = require('express');

const productController = require('../controller/product_controller.js')
const router = new Router()




router.get('/all-products', productController.getAllProducts)
router.get('/products/:region', productController.getProductsByRegion)
router.get('/products-by-query', productController.getProductsByQuery)
router.post('/product', productController.addProduct)
router.get('/product/:id', productController.getProductById)
router.get('/category-products/:id', productController.getProductsByCategoryId)
router.delete('/product/:id', productController.deleteProductById)




module.exports = router