const express = require('express');
const router = express.Router();
const {getMembers, getUserById} = require('../controllers/userController');

router.get('/members', getMembers);
router.get('/:id', getUserById);

module.exports = router;