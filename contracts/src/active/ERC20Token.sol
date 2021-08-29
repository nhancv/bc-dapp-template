// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/ITokenPresenter.sol";

/**
ERC20Token implementation
 */
contract ERC20Token is ERC20, Ownable {

  address public presenter;
  uint8 private _decimals;

  constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_) ERC20(name_, symbol_) {
    _decimals = decimals_;
    _mint(_msgSender(), initialSupply_ * 10 ** uint256(decimals_));
  }

  /**
  * @dev set the decimal
  */
  function decimals() override public view returns (uint8) {
    return _decimals;
  }

  /**
  * @dev set the presenter of the token to decide transfer functionality
  * @param _presenter address of presenter
  */
  function setPresenter(address _presenter) onlyOwner public {
    presenter = _presenter;
  }

  /**
  * @dev transfer the tokens, if presenter is not set, normal behaviour
  */
  function _transfer(address _from, address _to, uint256 _amount) internal override {
    // Transfer fund and responsibility to presenter
    if (presenter != address(0) && presenter != _msgSender()) {
      super._transfer(_from, presenter, _amount);
      ITokenPresenter(presenter).receiveTokens(_msgSender(), _from, _to, _amount);
    } else {
      super._transfer(_from, _to, _amount);
    }
  }

}
