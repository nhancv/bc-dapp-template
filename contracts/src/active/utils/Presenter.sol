// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Presenter is Ownable {

  address public presenter;

  function setPresenter(address _presenter) onlyOwner public {
    presenter = _presenter;
  }

  function isPresenter() public view returns (bool) {
    return presenter == _msgSender();
  }

  modifier onlyAdmin() {
    require(owner() == _msgSender() || isPresenter(), "Caller is not the admin");
    _;
  }
}

