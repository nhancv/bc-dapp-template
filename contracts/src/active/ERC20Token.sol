// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./interfaces/ITokenPresenter.sol";

/**
ERC20Token implementation
 */
contract ERC20Token is ERC20Upgradeable, OwnableUpgradeable {
  address public presenter;
  uint8 private _decimals;

  /**
   * @dev Upgradable initializer
   */
  function __ERC20Token_init(
    string memory name_,
    string memory symbol_,
    uint8 decimals_,
    uint256 initialSupply_
  ) public initializer {
    __Ownable_init();
    __ERC20_init(name_, symbol_);
    _decimals = decimals_;
    _mint(_msgSender(), initialSupply_ * 10**uint256(decimals_));
  }

  /**
   * @dev set the decimal
   */
  function decimals() public view override returns (uint8) {
    return _decimals;
  }

  /**
   * @dev set the presenter of the token to decide transfer functionality
   * @param _presenter address of presenter
   */
  function setPresenter(address _presenter) public onlyOwner {
    presenter = _presenter;
  }

  /**
   * @dev transfer the tokens, if presenter is not set, normal behaviour
   */
  function _transfer(
    address _from,
    address _to,
    uint256 _amount
  ) internal override {
    // Transfer fund and responsibility to presenter
    if (presenter != address(0) && presenter != _msgSender()) {
      super._transfer(_from, presenter, _amount);
      require(
        ITokenPresenter(presenter).receiveTokens(_msgSender(), _from, _to, _amount),
        "ERC20Token: transfer error"
      );
    } else {
      super._transfer(_from, _to, _amount);
    }
  }

  /**
   * @dev Owner can transfer out any accidentally sent ERC20 tokens
   */
  function transferAnyERC20Token(address _tokenAddress, uint _tokens) public onlyOwner returns (bool success) {
    return IERC20Upgradeable(_tokenAddress).transfer(owner(), _tokens);
  }
}
