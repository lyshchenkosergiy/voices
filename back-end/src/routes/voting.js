const express = require('express');

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

const router = express.Router();

router.get('/', getVotings);
router.get('/:id', getVotingById);
router.post('/', createVoting);
router.delete('/:id', deleteVotingById);
router.put('/:id', updateVoting);
router.post('/variant', createVotingVariant);
router.put('/variant/:id', updateVotingVariant);
router.delete('/variant/:id', deleteVotingVariant);
router.post('/start/:id', startVoting);
router.post('/finish/:id', finishVoting);
router.post('/member', createMember);
router.post('/member/accept/:id', acceptMember);
router.post('/member/decline/:id', declineMember);
router.post('/vote', vote);

module.exports = router;
