const express = require("express");
const router = express.Router()
const { getCourses } = require('../controllers/courseController.js');

router.get('/', getCourses);

module.exports = router