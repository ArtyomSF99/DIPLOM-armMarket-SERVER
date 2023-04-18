const db = require('../db')
const transactionService = require('../service/transaction_service')


class TransactionController {
   
    async saveTransaction (req, res, next) {
        try{
            const buyerId = req.body.buyer_id;
            const sellerId = req.body.seller_id;
            const productId = req.body.product_id;
            const amount = req.body.amount;
            const result = await transactionService.saveTransaction(buyerId, sellerId, productId, amount)
            return res.json(result)
        }
        catch (e){
            next(e)
        }
    }
    
  
}

module.exports = new TransactionController()