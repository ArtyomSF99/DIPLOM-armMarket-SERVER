const db = require('../db')
const path = require('path')
const fs = require('fs')
const productService = require('../service/product_service')
const UtilService = require('../service/util_service')


class ProductController {

    async addProduct (req, res, next) {
        try{
            //console.log(req.body)
            const imgArray = req.files
            const productParams = req.body
            const categoryFolder = req.headers.folder
            const productFolder = req.headers.product
            const product = await productService.addProduct(imgArray, productParams, categoryFolder, productFolder)
            
            res.json(product)
            
        }
        catch (e){
           next(e)
        }
    }

    async getAllProducts( req, res, next){
        try{
            const products = await db.query(`SELECT * FROM products`)
            res.json(products.rows)
        }
        catch(e){

        }
    }
    async getProductById( req, res, next){
        try{
            const id = req.params.id
            const product = await productService.getProductById(id)
            res.json(product)
        }
        catch(e){

        }
    }
    async getProductsByRegion( req, res, next){
        try{
            const region = req.params.region
            const products = await productService.getProductsByRegion(region)
            res.json(products)
        }
        catch(e){

        }
    }
    async getProductsByQuery( req, res, next){
        try{
            const query = req.query.query
            const products = await productService.getProductsByQuery(query)
            res.json(products)
        }
        catch(e){

        }
    }

    async getProductsByCategoryId (req, res, next){
        try{
            const id = Number(req.params.id)
            let index = 2
            let sqlArray =[id]
            console.log('hello')
            let sql = "SELECT * FROM products WHERE product_category_id=$1"
            for (let key in req.query) {
               console.log(req.query[key])
               sql += ` OR product_category_id=$${index}`
               sqlArray.push(Number(req.query[key]))
                index ++
            }
            const products = await db.query(sql,sqlArray)
            res.json(products.rows)
        }
        catch(e){

        }
    }
    async deleteProductById( req, res, next){
        try{
            const id = req.params.id
            const product_folder = req.query.product_folder
            const category_id = req.query.category_id
             const category_folder = await db.query('SELECT name FROM categories WHERE id=$1', [category_id])
            // console.log(category_folder.rows[0].name)
             const product_folder_path = path.join('uploads', category_folder.rows[0].name, product_folder)
            // console.log(product_folder_path)
            await db.query('DELETE FROM products WHERE id=$1',[id])
            UtilService.deleteFolder(product_folder_path)
            res.sendStatus(200)
        }
        catch(e){

        }
    }
   
}

module.exports = new ProductController()