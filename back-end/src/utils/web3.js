const Web3 = require('web3');

const {
  VUE_APP_INFURA_URL,
  BACK_END_OWNER_PRIVATE_KEY
} = process.env;
const GAS_LIMIT = 21000;

const web3 = new Web3(new Web3.providers.HttpProvider(VUE_APP_INFURA_URL));
const { address: from } = web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(BACK_END_OWNER_PRIVATE_KEY));

module.exports = {
  sendFunds: async (to, value, gas = GAS_LIMIT) => {
    const parentBalance = await web3.eth.getBalance(from);
    console.log('OWNER BALANCE ---> ', web3.utils.fromWei(parentBalance, 'ether'));
    return await web3.eth.sendTransaction({ from, to, value, gas });
  }
};