const express = require("express");
const router = express.Router()
const { addEnrollment } = require('../controllers/enrollmentController');

router.post('/', addEnrollment);

module.exports = router