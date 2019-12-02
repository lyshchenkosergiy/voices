pragma solidity ^0.5.0;

contract Voting {
  enum State { Created, Started, Finished }

  address public owner;

	State public state;

  mapping(bytes32 => uint) public variants;
  mapping(address => bool) public voters;

  constructor() public {
    owner = msg.sender;
    state = State.Created;
  }

  modifier byOwner() {
    require(msg.sender == owner, "Only owner may call this method!");
      _;
	}

  modifier correctState(State _state) {
		require(state == _state, "Invalid voting state!");
      _;
	}

  function addVariant(bytes32 name) public byOwner correctState(State.Created) {
    variants[name] = 1;
  }

  function addVoter(address voterAddress) public byOwner correctState(State.Created) {
    voters[voterAddress] = false;
  }

  function startVoting() public byOwner correctState(State.Created) {
    state = State.Started;
  }

  function addVote(bytes32 name) public correctState(State.Started) {
    require(voters[msg.sender] == false, 'Can not vote!');
    require(variants[name] != 0, 'Wrong variant!');
    variants[name] = variants[name] + 1;
    voters[msg.sender] = true;
  }

  function finishVoting() public byOwner correctState(State.Started) {
    state = State.Finished;
  }

  function getResults(bytes32 name) public correctState(State.Finished) view
    returns (uint count)
  {
    count = variants[name] - 1;
  }
}