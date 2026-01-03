const express = require("express");
const router = express.Router();
const { seedOnStartupRandom } = require("../controllers/seedController");

router.post("/", async (req, res) => {
    try {
        await seedOnStartupRandom({ reset: true });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

module.exports = router;
