const { requestFunds } = require('../services/system');

module.exports = {
  async requestFunds(req, res, next) {
    try {
      const { body } = req;
      const result = await requestFunds(body);
      if (result.message) {
        return res.status(400).send({ message: result.message });
      }
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
};
