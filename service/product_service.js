const db = require('../db')
const fs = require('fs')
const path = require('path')
class ProductService {
    async addProduct (imgArray, productParams, categoryFolder, productFolder) {
        const saveProductSQL = 'INSERT INTO products (user_id, product_category_id, product_name, product_price, product_discription,  exhibition_date,exhibition_time,product_folder, product_main_photo_path) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9) RETURNING *'
        const productParamsArray =  [Number(productParams.user_id), Number(productParams.category_id), productParams.product_name,productParams.product_price,productParams.product_discription,productParams.date, productParams.time, productFolder, `${categoryFolder}/${productFolder}/${imgArray[0].filename}`]
        const product = await db.query(saveProductSQL, productParamsArray)
        const products_attributes = JSON.parse(productParams.attributes)
        let response_product_attributes = []
        if(products_attributes.length !==0){
            let saveAttributesSQL = `INSERT INTO products_attributes (attribute_id, product_id, attribute_value) VALUES `
            let saveAttributesArray = []
            for(let i =0; i<products_attributes.length; i++){
                let next =`,`
                if(i === products_attributes.length-1){
                    next = 'RETURNING *'
                }
                let query = `($${1+i*3}, $${2+i*3}, $${3+i*3})`+ next
                saveAttributesSQL += query
                saveAttributesArray.push(products_attributes[i].attribute.id)
                saveAttributesArray.push(product.rows[0].id)
                saveAttributesArray.push(products_attributes[i].attribute_value)
            }
            response_product_attributes = await db.query(saveAttributesSQL, saveAttributesArray)
        }
        let saveImagesSQL = `INSERT INTO photo_path (product_id, photo_path) VALUES `
        let saveImagesArray = []
        for(let i =0; i<imgArray.length; i++){
            let next =`,`
            if(i === imgArray.length-1){
                next = 'RETURNING *'
            }
            let query = `($${1+i*2}, $${2+i*2})`+ next
            saveImagesSQL += query
            saveImagesArray.push(product.rows[0].id)
            saveImagesArray.push(`${categoryFolder}/${productFolder}/${imgArray[i].filename}`)
      
        }
        const response_images_path = await db.query(saveImagesSQL, saveImagesArray)
        console.log(response_product_attributes.rows)
        const respons = {product:product.rows[0],product_attributes:response_product_attributes.rows,product_images:response_images_path.rows}
        return respons
    }
    async getProductById (id) {
        const images_path = await db.query(`SELECT * FROM photo_path WHERE product_id = $1`, [id])
        const product_params = await db.query('SELECT * FROM products WHERE id=$1',[id])
        console.log(product_params.rows[0])
        const product_user = await db.query(`SELECT id, first_name, last_name, email, phone,region, avatar_path, account_rating, account_rating_count FROM users
        WHERE id = $1`, [product_params.rows[0].user_id])
      
        console.log(product_user.rows[0])
        const attributesSQL = 'SELECT attributes.id, attributes.attribute_name, products_attributes.attribute_value FROM products_attributes JOIN attributes ON products_attributes.attribute_id = attributes.id WHERE products_attributes.product_id=$1'
        const attributes = await db.query(attributesSQL, [id])
        console.log(attributes.rows)
        const response = {images_path:images_path.rows,product_params:product_params.rows[0], product_user:product_user.rows[0], attributes:attributes.rows}
        return response
    }
    async getProductsByRegion(region){
        const sql = `SELECT products.*
        FROM products
        JOIN users ON products.user_id = users.id
        WHERE users.region = $1`
        const products = await db.query(sql, [region])
        return products.rows
    }
    async getProductsByQuery(query){
        const value = `%${query}%`
        const sql = `SELECT * FROM products WHERE product_name LIKE $1 `
        const products = await db.query(sql, [value])
        return products.rows
    }
}

module.exports = new ProductService()