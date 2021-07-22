// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Migration {
  address public owner = msg.sender;
  address public instance;

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCompleted(address _instance) public restricted {
    instance = _instance;
  }
}
