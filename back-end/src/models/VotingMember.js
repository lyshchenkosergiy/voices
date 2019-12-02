const { Schema, model } = require('mongoose');

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userPublicKey: {
    type: String,
    required: true
  },
  votingId: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['Requested', 'Accepted', 'Declined'],
    required: true,
    default: 'Requested'
  }
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('voting', {
  ref: 'Voting',
  localField: 'votingId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('profile', {
  ref: 'Profile',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true
});

module.exports = model('VotingMember', schema);
