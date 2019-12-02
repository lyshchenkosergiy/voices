const express = require('express');

const { 
  getProfile,
  createProfile,
  updateProfile
} = require('../controllers/profile');

const router = express.Router();

router.get('/me', getProfile);
router.post('/init', createProfile);
router.put('/update', updateProfile);

module.exports = router;
