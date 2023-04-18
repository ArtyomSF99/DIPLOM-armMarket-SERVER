const Router = require("express");

const transactionController = require("../controller/transacton_controller");
const router = new Router();

router.post("/order-product", transactionController.saveTransaction);

module.exports = router;
