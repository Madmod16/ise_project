const express = require("express");
const router = express.Router()
const { addPayment } = require('../controllers/paymentController');

router.post('/', addPayment);

module.exports = router