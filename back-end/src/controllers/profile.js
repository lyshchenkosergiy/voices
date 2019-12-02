const { 
  getProfile,
  createProfile,
  updateProfile
} = require('../services/profile');

module.exports = {
  async getProfile(req, res, next) {
    try {
      const { userId } = req;
      const profile = await getProfile(userId);
      res.status(200).send(profile);
    } catch (error) {
      next(error);
    }
  },
  async createProfile(req, res, next) {
    try {
      const { userId, body } = req;
      const profile = await createProfile(userId, body);
      res.status(200).send(profile);
    } catch (error) {
      next(error);
    }
  },
  async updateProfile(req, res, next) {
    try {
      const { userId, body } = req;
      const profile = await updateProfile(userId, body);
      res.status(200).send(profile);
    } catch (error) {
      next(error);
    }
  }
};
