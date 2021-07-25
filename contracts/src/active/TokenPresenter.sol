// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITokenPresenter.sol";

contract OrosPresenter is ITokenPresenter {

  address public token;

  constructor() {
    token = address(0);
  }

  function setToken(address token_) public {
    require(token_ != address(0), "OrosToken: address to the zero address");
    token = token_;
  }

  function receiveTokens(address, address to_, uint256 value_) public virtual override returns (bool) {
    require(msg.sender == token, "OrosPresenter: Only trigger from token");
    IERC20 erc20 = IERC20(token);
    erc20.transfer(to_, value_);
    return true;
  }

}
