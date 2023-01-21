const db = require('../db')
const fs = require('fs')

class ChatService {

    async getMessagesById(user1_id, user2_id){
        const messages = await db.query(`SELECT * FROM chats WHERE (user1_id=$1 AND user2_id=$2) OR (user1_id=$2 AND user2_id=$1)`, [user1_id, user2_id])
        return messages.rows
    }
   
}

module.exports = new ChatService()