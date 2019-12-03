const express = require('express');
const Joi = require('joi');

const { requestFunds } = require('../controllers/system');
const validate = require('../utils/joi-validate');

const requestSchema = Joi.object().keys({
  address: Joi.string().required(),
  value: Joi.string().required()
});

const router = express.Router();

router.post('/request-funds', validate(requestSchema), requestFunds);

module.exports = router;
