// routes/mongodb.js
const express = require('express');
const router = express.Router();

const {
  createCollections,
  migrateMembers,
  migrateProgram,
  migrateCourses,
  checkIfMongoDBIsActive,
  migrateTutors
} = require('../nosqlControllers/dbController');

const { getMongoMembers } = require('../nosqlControllers/membernosqlController');
const { getMongoPrograms, addEnrollment } = require('../nosqlControllers/programnosqlController');
const { getAnaliticsReport } = require('../nosqlControllers/reportnosqlController');
const { getMongoTutors } = require('../nosqlControllers/tutornosqlController');
const { addModuleToCourseMongo, getModulesReportMongo } = require('../nosqlControllers/modulenosqlController');

router.get('/', createCollections);
router.get('/check', checkIfMongoDBIsActive);
router.get('/mongoMember', getMongoMembers);
router.get('/mongoPrograms', getMongoPrograms);
router.get('/mongoTutors', getMongoTutors);
router.post('/mongoAddEnrollment', addEnrollment);
router.post('/mongoReport', getAnaliticsReport);
router.post('/modules', addModuleToCourseMongo);
router.post('/modules/report', getModulesReportMongo);

router.get("/migrateAll", async (req, res) => {
  try {
    await migrateMembers();
    await migrateCourses();
    await migrateProgram();
    await migrateTutors();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
