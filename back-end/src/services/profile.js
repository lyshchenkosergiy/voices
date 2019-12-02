const { Profile } = require('../models');

module.exports = {
  async getProfile(userId) {
    const profile = await Profile.findOne({ userId });
    return profile;
  },
  async createProfile(userId, profileData) {
    const profile = await Profile.create({ userId, ...profileData });
    return profile;
  },
  async updateProfile(userId, profileData) {
    const profile = await Profile.findOneAndUpdate({ userId }, profileData, { new: true });
    return profile;
  }
};
