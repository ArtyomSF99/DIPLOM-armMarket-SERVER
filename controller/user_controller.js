const db = require('../db')
const userService = require('../service/user_service')


class UserController {
   
    async getUserById (req, res, next) {
        try{
            const id = req.params.id
            const user = await userService.getUserById(id);
            return res.json(user)
        }
        catch (e){
            next(e)
        }
    }
    async getOpinionsByUserId (req, res, next) {
        try{
            const id = req.params.id
            const user_opinion = await userService.getOpinionsByUserId(id);
            return res.json(user_opinion)
        }
        catch (e){
            next(e)
        }
    }
    async createOpinionByUserId (req, res, next) {
        try{
            const user_id = req.body.user_id
            const sender_user_id = req.body.sender_user_id
            const avatar_path =req.body.avatar_path
            const user_name = req.body.user_name
            const opinion = req.body.opinion
            const exhibition_date = req.body.exhibition_date
            const exhibition_time = req.body.exhibition_time
            const new_opinion = await userService.createOpinionByUserId(user_id, sender_user_id, avatar_path,user_name, opinion, exhibition_date,exhibition_time);
            return res.json(new_opinion)
        }
        catch (e){
            next(e)
        }
    }
    async updateOpinionByUserId(req,res,next){
        try{
            const opinion_id = req.body.opinion_id
            const new_opinion = req.body.new_opinion
            console.log(opinion_id)
            console.log(new_opinion)
            const update_opinion = await userService.updateOpinionById(opinion_id, new_opinion)
            return res.json(update_opinion)

        }catch(e){
            next(e)
        }
    }
    async deleteOpinionsById (req, res, next) {
        try{
            const id = req.params.id
            const delete_opinion = await userService.deleteOpinionById(id);
            return res.json(delete_opinion)
        }
        catch (e){
            next(e)
        }
    }
  
}

module.exports = new UserController()