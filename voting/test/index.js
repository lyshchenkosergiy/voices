const Voting = artifacts.require('Voting');
const Ballot = artifacts.require('Ballot');
require('truffle-test-utils').init();

contract('Ballot', (accounts) => {
  const from = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];

  it('Simple voting', async () => {
    const instance = await Voting.new([
      web3.utils.asciiToHex('variant1'),
      web3.utils.asciiToHex('variant2'),
      web3.utils.asciiToHex('variant3')
    ], { from });

    await instance.addVoter(voter1, { from });
    await instance.addVoter(voter2, { from });
    await instance.addVoter(voter3, { from });

    await instance.startVoting({ from });
    await instance.addVote(web3.utils.asciiToHex('variant1'), { from: voter1 })
    await instance.finishVoting({ from });
  });

  it('Simple voting', async () => {
    const instance = await Ballot.new([
      web3.utils.asciiToHex('variant1'),
      web3.utils.asciiToHex('variant2'),
      web3.utils.asciiToHex('variant3')
    ]);

    await instance.giveRightToVote(voter1, { from });
    await instance.giveRightToVote(voter2, { from });
    await instance.giveRightToVote(voter3, { from });

    await instance.vote(0, { from: voter1 });
  });
});
