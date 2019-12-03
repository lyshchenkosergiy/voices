const express = require('express');
const Joi = require('joi');

const {
  getVotings,
  createVoting,
  getVotingById,
  deleteVotingById,
  createVotingVariant,
  deleteVotingVariant,
  updateVotingVariant,
  startVoting,
  finishVoting,
  createMember,
  acceptMember,
  declineMember,
  vote,
  updateVoting
} = require('../controllers/voting');
const validate = require('../utils/joi-validate');

const createVotingSchema = Joi.object().keys({
  address: Joi.string().required(),
  name: Joi.string().min(6).max(16).required(),
  description: Joi.string().min(6).max(200).required(),
  anonymous: Joi.bool().required(),
  avatar: Joi.string()
});
const updateVotingSchema = Joi.object().keys({
  avatar: Joi.string().allow('')
});

const createVariantSchema = Joi.object().keys({
  votingId: Joi.string().required(),
  name: Joi.string().min(6).max(16).required(),
  description: Joi.string().min(6).max(200).required(),
  avatar: Joi.string().allow('')
});
const updateVariantSchema = Joi.object().keys({
  name: Joi.string().min(6).max(16),
  description: Joi.string().min(6).max(200),
  avatar: Joi.string().allow('')
});

const createMemberSchema = Joi.object().keys({
  userPublicKey: Joi.string().required(),
  votingId: Joi.string().required()
});
const createVoteSchema = Joi.object().keys({
  transactionHash: Joi.string().required(),
  variantId: Joi.string().required(),
  votingId: Joi.string().required()
});

const router = express.Router();

router.get('/', getVotings);
router.get('/:id', getVotingById);
router.post('/', validate(createVotingSchema), createVoting);
router.delete('/:id', deleteVotingById);
router.put('/:id', validate(updateVotingSchema), updateVoting);
router.post('/variant', validate(createVariantSchema), createVotingVariant);
router.put('/variant/:id', validate(updateVariantSchema), updateVotingVariant);
router.delete('/variant/:id', deleteVotingVariant);
router.post('/start/:id', startVoting);
router.post('/finish/:id', finishVoting);
router.post('/member', validate(createMemberSchema), createMember);
router.post('/member/accept/:id', acceptMember);
router.post('/member/decline/:id', declineMember);
router.post('/vote', validate(createVoteSchema), vote);

module.exports = router;
