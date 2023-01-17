const db = require('../db')
const fs = require('fs')

class UserService {
    async getUserById (id) {
        const user = await db.query(`SELECT id, first_name, last_name, email, phone,region, avatar_path, account_rating, account_rating_count FROM users WHERE id=$1`,[id])
        const user_opinion = await db.query(`SELECT * FROM user_opinion WHERE user_id=$1`,[id])
        const user_products = await db.query(`SELECT * FROM products where user_id=$1`, [id])
        const user_info = {user:user.rows[0], user_opinion:user_opinion.rows, user_products:user_products.rows} 
        return user_info
    }
    async getOpinionsByUserId(id){
        const user_opinion = await db.query(`SELECT * FROM user_opinion WHERE user_id=$1`, [id])
        return user_opinion.rows
    }
   async createOpinionByUserId(user_id, sender_user_id, avatar_path,user_name, opinion, exhibition_date,exhibition_time) {
        const new_opinion = await db.query(`INSERT INTO user_opinion (user_id, sender_user_id, avatar_path,user_name, opinion, exhibition_date,exhibition_time) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[user_id, sender_user_id, avatar_path,user_name, opinion, exhibition_date,exhibition_time])
        return new_opinion.rows[0]
    }
    async updateOpinionById(opinion_id, new_opinion){
        const update_opinion = await db.query('UPDATE user_opinion SET opinion=$1 WHERE id=$2 RETURNING *',[new_opinion,opinion_id])
        return update_opinion.rows[0]
    }
    async deleteOpinionById(id){
        const delete_opinion = await db.query(`DELETE FROM user_opinion WHERE id=$1 RETURNING *`, [id])
        return delete_opinion
    }
}

module.exports = new UserService()