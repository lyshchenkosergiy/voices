const express = require('express');

const { requestFunds } = require('../controllers/system');

const router = express.Router();

router.post('/request-funds', requestFunds);

module.exports = router;
