const express = require('express');
const Joi = require('joi');

const {
  getProfile,
  createProfile,
  updateProfile
} = require('../controllers/profile');
const validate = require('../utils/joi-validate');

const createSchema = Joi.object().keys({
  email: Joi.string().required(),
  firstName: Joi.string().min(6).max(16).required(),
  lastName: Joi.string().min(6).max(16).required(),
  wallet: Joi.string().required(),
  avatar: Joi.string().allow('')
});

const updateSchema = Joi.object().keys({
  avatar: Joi.string().allow('')
});

const router = express.Router();

router.get('/me', getProfile);
router.post('/init', validate(createSchema), createProfile);
router.put('/update', validate(updateSchema), updateProfile);

module.exports = router;
