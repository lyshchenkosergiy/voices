const { Schema, model } = require('mongoose');

const schema = new Schema({
  memberId: {
    type: String,
    required: true
  },
  votingId: {
    type: String,
    required: true
  },
  variantId: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  }
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('member', {
  ref: 'VotingMember',
  localField: 'memberId',
  foreignField: '_id',
  justOne: true
});

schema.virtual('variant', {
  ref: 'VotingVariant',
  localField: 'variantId',
  foreignField: '_id',
  justOne: true
});

module.exports = model('Vote', schema);
