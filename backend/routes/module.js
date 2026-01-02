const express = require("express");
const router = express.Router();
const { addModuleToCourse, getModulesReport } = require("../controllers/moduleController");

router.post("/", addModuleToCourse);
router.post("/report", getModulesReport);

module.exports = router;
