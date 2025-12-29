const express = require("express");
const router = express.Router()
const { getProgramsWithCourses } = require('../controllers/programController');

router.get('/', getProgramsWithCourses);

module.exports = router