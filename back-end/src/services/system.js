const { sendFunds } = require('../utils/web3');

module.exports = {
  async requestFunds(data) {
    try {
      const { address, value } = data;
      await sendFunds(address, value);
      return true;
    } catch (error) {
      return { message: error.message || error };
    }
  }
};
