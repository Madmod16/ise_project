const express = require("express");
const router = express.Router()
const { getProgramsWithCourses, getAnalyticsReport } = require('../controllers/programController');

router.get('/', getProgramsWithCourses);
router.post('/student1Report', getAnalyticsReport);

module.exports = router