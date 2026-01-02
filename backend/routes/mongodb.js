const express = require('express');
const router = express.Router();
const { createCollections, migrateMembers, migrateProgram, migrateCourses, checkIfMongoDBIsActive } = require('../nosqlControllers/dbController');
const { getMongoMembers } = require('../nosqlControllers/membernosqlController');
const { getMongoPrograms, addEnrollment } = require('../nosqlControllers/programnosqlController');
const { getAnaliticsReport } = require('../nosqlControllers/reportnosqlController');

router.get('/', createCollections);
router.get('/check', checkIfMongoDBIsActive);
router.get('/mongoMember', getMongoMembers);
router.get('/mongoPrograms', getMongoPrograms)
router.post('/mongoAddEnrollment', addEnrollment)
router.post('/mongoReport', getAnaliticsReport)
router.get('/migrateMembers', migrateMembers);
router.get('/migratePrograms', migrateProgram);
router.get('/migrateCourses', migrateCourses);


module.exports = router;