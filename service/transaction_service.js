const db = require('../db')
const { v4: uuidv4 } = require('uuid');

class TransactionService {
    async saveTransaction (buyerId, sellerId, productId, amount) {
        const code = uuidv4();
        const transaction = await db.query(`INSERT INTO transactions (buyer_id, seller_id, product_id, amount, code) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [buyerId, sellerId, productId, amount, code])
    
        return code
    }
}

module.exports = new TransactionService()