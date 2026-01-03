// routes/seed.js
const express = require("express");
const router = express.Router();
const { seedRandom } = require("../controllers/seedController");

router.post("/", seedRandom);

module.exports = router;
