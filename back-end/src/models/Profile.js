const { Schema, model } = require('mongoose');

const schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  wallet: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false,
    default: ''
  }
}, { timestamps: true });

module.exports = model('Profile', schema);
