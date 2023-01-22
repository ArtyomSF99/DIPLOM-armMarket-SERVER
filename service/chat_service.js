const db = require('../db')
const fs = require('fs')

class ChatService {

    async getMessagesById(user1_id, user2_id){
        const messages = await db.query(`SELECT * FROM chats WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)`, [user1_id, user2_id])
        return messages.rows
    }
    async saveMessage(message) {
        const newMessage = await db.query(`INSERT INTO chats (sender_id, receiver_id, sender_name, sender_avatar_path,message,message_date,message_time) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[message.sender_id, message.receiver_id, message.sender_name,message.sender_avatar_path,message.message,message.message_date,message.message_time])
        return newMessage.rows[0]
    }
   
}

module.exports = new ChatService()