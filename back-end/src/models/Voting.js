const { Schema, model } = require('mongoose');

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['Created', 'Started', 'Finished'],
    required: true,
    default: 'Created'
  },
  anonymous: {
    type: Boolean,
    required: true
  },
  avatar: {
    type: String,
    required: false,
    default: ''
  },
  address: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('variants', {
  ref: 'VotingVariant',
  localField: '_id',
  foreignField: 'votingId'
});

schema.virtual('members', {
  ref: 'VotingMember',
  localField: '_id',
  foreignField: 'votingId'
});

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'votingId'
});

module.exports = model('Voting', schema);
