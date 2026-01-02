const express = require("express");
const router = express.Router();
const { getTutors, getTutorCourses } = require("../controllers/tutorController");

router.get("/", getTutors);
router.get("/:id/courses", getTutorCourses);

module.exports = router;

