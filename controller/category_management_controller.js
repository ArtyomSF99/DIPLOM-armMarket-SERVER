const db = require('../db')
const categoryManagementService = require('../service/categories_management_service')


class CategoryManagementController {
   
    async getCategories (req, res, next) {
        try{
            const categories = await categoryManagementService.getCategories();
            return res.json(categories.rows)
        }
        catch (e){
            next(e)
        }
    }
    async createCategory (req, res, next) {
        try{
            const name = req.body.name
            let parent = req.body.parent
            let main_parent = req.body.main_parent
            if(!parent){
                parent = ""
            }
            if(!main_parent){
                main_parent = ""
            }
             const category = await categoryManagementService.createCategory(name, parent, main_parent);
             return res.json(category.rows)
        }
        catch (e){
            next(e)
        }
    }
    async updateCategory (req, res, next) {
        try{   
            const id = req.body.id
            const name = req.body.name
            const old_name = req.body.old_name
            const category = await categoryManagementService.updateCategory(id,name, old_name);
            return res.json(category.rows)
        }
        catch (e){
            next(e)
        }
    }
    async deleteCategory (req, res, next) {
        try{   
            const id = req.params.id
            const name = req.query.name
            await categoryManagementService.deleteCategory(id, name);
            return res.sendStatus(200)
        }
        catch (e){
            next(e)
        }
    }

    async getAttributes (req, res, next) {
        try{
            const Attrubutes = await categoryManagementService.getAttributes()
            return res.json(Attrubutes.rows)
        }
        catch (e){
            next(e)
        }
    }
    async createAttribute( req, res, next){
        try{
            const category_id = req.body.category_id
            const attribute_name = req.body.attribute_name
            const attribute = await categoryManagementService.createAttribute(category_id, attribute_name)
            res.json(attribute.rows)
        }
        catch(e){
        }
    }
    async updateAttribute (req, res, next) {
        try{
            const id = req.body.id
            const new_attribute_name = req.body.new_attribute_name
            const attribute = await categoryManagementService.updateAttribute(id,new_attribute_name);
            return res.json(attribute.rows)
        }
        catch (e){
            next(e)
        }
    }
    async deleteAttribute (req, res, next) {
        try{  
            const id = req.params.id
            await categoryManagementService.deleteAttribute(id);
            return res.sendStatus(200)
        }
        catch (e){
            next(e)
        }
    }
}

module.exports = new CategoryManagementController()