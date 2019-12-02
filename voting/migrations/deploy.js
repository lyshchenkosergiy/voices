const Voting = artifacts.require('Voting');

module.exports = async function (deployer, network) {
  await deployer.deploy(Voting);
};
