const express = require('express');
const router = express.Router();
const { getMongoMembers } = require('../nosqlControllers/membernosqlController');

router.get('/', getMongoMembers);

module.exports = router;