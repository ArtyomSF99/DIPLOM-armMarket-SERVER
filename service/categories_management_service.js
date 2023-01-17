const db = require('../db')
const fs = require('fs')
const util_service = require('./util_service')

class CategoriesManagement {
    async getCategories () {
        const categories = await db.query('SELECT * FROM categories')
        return categories
    }
    async createCategory(name, parent, main_parent) {
        const category = await db.query('INSERT INTO categories (name, parent, main_parent) VALUES ($1, $2, $3) RETURNING *', [name, parent, main_parent])
        fs.mkdir(`uploads/${name}`,err => {
            if(err) {
                console.log(err)
            }; 
            console.log('Папка успешно создана')})
        return category
    }
    async updateCategory(id, name, oldName) {
        const category = await db.query('UPDATE categories SET name=$1 WHERE id=$2 RETURNING *', [name,id])
        await db.query('UPDATE categories SET parent=$1 WHERE parent=$2',[name, oldName])
        await db.query('UPDATE categories SET main_parent=$1 WHERE main_parent=$2',[name, oldName])
        fs.rename(`uploads/${oldName}`, `uploads/${name}`, (err) => {
            if (err) {
              console.error(err);
            }
            console.log('Папка переименована');
          });
        return category
    }
    async deleteCategory(id, name) {
        await db.query(`DELETE FROM categories WHERE id=$1 OR parent=$2 OR main_parent=$2`, [id, name])
        util_service.deleteFolder(`uploads/${name}`)
       
    }
    async getAttributes() {
        const Attributes = await db.query('SELECT * FROM attributes')
        return Attributes
    }
    async createAttribute(category_id, attribute_name) {
        const Attribute = await db.query('INSERT INTO attributes (category_id, attribute_name) VALUES ($1, $2) RETURNING *', [category_id, attribute_name])
        return Attribute
    }
    async updateAttribute(id,new_attribute_name) {
        const  Attribute = await db.query(`UPDATE attributes SET attribute_name=$1 WHERE id=$2 RETURNING *`, [new_attribute_name, id])
        return Attribute
    }
    async deleteAttribute(id) {
         await db.query(`DELETE FROM attributes WHERE id=$1`, [id])
    }
}

module.exports = new CategoriesManagement()