const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  votingId: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false,
    default: ''
  }
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('voting', {
  ref: 'Voting',
  localField: 'votingId',
  foreignField: '_id',
  justOne: true
});

module.exports = model('VotingVariant', schema);
