const { Voting, VotingVariant, VotingMember, Vote } = require('../models');

module.exports = {
  async getVotings(userId, my = false) {
    const query = my ? { userId } : { userId: { $ne: userId }};
    const votings = await Voting.find(query)
      .populate('variants')
      .populate('votes')
      .populate('members');
    return votings;
  },
  async getVotingById(id) {
    const voting = await Voting.findById(id)
      .populate('variants')
      .populate({path: 'members',
        model: 'VotingMember',
        populate: {
          path: 'profile',
          model: 'Profile'
      }});

    const populateVotesSettings = voting.anonymous
      ? {
        select: '-memberId',
        populate: [{ path: 'variant', model: 'VotingVariant' }]
      }
      : {
        populate: [{ 
          path: 'variant',
          model: 'VotingVariant' 
        }, {
          path: 'member',
          model: 'VotingMember',
          populate: {
            path: 'profile',
            model: 'Profile'
          }
        }]
      };

    await Voting.populate(voting, { path: 'votes', ...populateVotesSettings });
    return voting;
  },
  async createVoting(userId, votingData) {
    const voting = await Voting.create({ userId, ...votingData });
    return voting;
  },
  async updateVoting(userId, _id, votingData) {
    const oldVoting = await Voting.findById(_id);
    if (oldVoting.state !== 'Created') {
      return { message: 'Can not be updated after voting start!' };
    }
    const voting = await Voting.findOneAndUpdate({ userId, _id }, votingData, { new: true });
    return voting;
  },
  async deleteVotingById(userId, _id) {
    const voting = await Voting.findOneAndRemove({ userId, _id });
    return voting ? voting._id : { message: 'Only owner can delete voting!' };
  },
  async createVotingVariant(userId, variantData) {
    const voting = await Voting.findOne({ userId, _id: variantData.votingId });
    if (!voting) {
      return { message: 'Only owner can add variant!' };
    }
    const votingVariant = await VotingVariant.create(variantData);
    return votingVariant;
  },
  async deleteVotingVariant(userId, _id) {
    const variant = await VotingVariant.findById(_id).populate('voting');
    if (userId !== variant.voting.userId) {
      return { message: 'Only owner can delete variant!' };
    }
    await VotingVariant.findOneAndRemove({ _id });
    return _id;
  },
  async updateVotingVariant(userId, _id, variantData) {
    const oldVariant = await VotingVariant.findById(_id).populate('voting');
    if (userId !== oldVariant.voting.userId) {
      return { message: 'Only owner can update variant!' };
    }
    if (oldVariant.voting.state !== 'Created') {
      return { message: 'Can not be updated after voting start!' };
    }
    const variant = await VotingVariant.findByIdAndUpdate(_id, variantData, { new: true });
    return variant;
  },
  async startVoting(userId, _id) {
    const voting = await Voting.findOneAndUpdate({ userId, _id }, { state: 'Started' });
    return voting || { message: 'Only owner can start voting!' };
  },
  async finishVoting(userId, _id) {
    const voting = await Voting.findOneAndUpdate({ userId, _id }, { state: 'Finished' });
    return voting || { message: 'Only owner can finish voting!' };
  },
  async createMember(userId, votingId, userPublicKey) {
    const existedMember = await VotingMember.findOne({ userId, votingId });
    if (!existedMember) {
      const member = await VotingMember.create({ userId, votingId, userPublicKey });
      return member;
    }
    if (existedMember.state === 'Requested') {
      return { message: 'You are already made join request!' };
    }
    if (existedMember.state === 'Accepted') {
      return { message: 'You are already member!' };
    }
    if (existedMember.state === 'Declined') {
      return { message: 'Owner declined your join request!' };
    }
  },
  async acceptMember(userId, _id) {
    const existedMember = await VotingMember.findById(_id).populate('voting');

    if (!existedMember || existedMember.voting.userId !== userId) {
      return { message: 'Only owner can accept members!' };
    }
    if (existedMember.state === 'Accepted') {
      return { message: 'Member already accepted!' };
    }
    if (existedMember.state === 'Declined') {
      return { message: 'Member already declined!' };
    }

    const member = await VotingMember.findByIdAndUpdate(_id, { state: 'Accepted' }, { new: true }).populate('profile');
    return member;
  },
  async declineMember(userId, _id) {
    const existedMember = await VotingMember.findById(_id).populate('voting');

    if (!existedMember || existedMember.voting.userId !== userId) {
      return { message: 'Only owner can decline members!' };
    }
    if (existedMember.state === 'Accepted') {
      return { message: 'Member already accepted!' };
    }
    if (existedMember.state === 'Declined') {
      return { message: 'Member already declined!' };
    }

    const member = await VotingMember.findByIdAndUpdate(_id, { state: 'Declined' }, { new: true }).populate('profile');
    return member;
  },
  async vote(userId, votingId, variantId, transactionHash) {
    const voting = await Voting.findById(votingId)
      .populate('variants')
      .populate('members')
      .populate('votes');
    
    if (!voting) {
      return { message: 'Voting doesn\'t exist!' };
    }
    if (!voting.variants.find(({ _id }) => _id == variantId)) {
      return { message: 'Variant doesn\'t exist!' };
    }
    const votingMember = voting.members.find((member) => member.userId == userId);
    if (!votingMember) {
      return { message: 'You are not a member!' };
    }
    if (voting.votes.find(({ memberId }) => memberId == votingMember._id)) {
      return { message: 'Your vote already added!' };
    }

    const vote = await Vote.create({ memberId: votingMember._id, votingId, variantId, transactionHash });
    return vote;
  }
};
