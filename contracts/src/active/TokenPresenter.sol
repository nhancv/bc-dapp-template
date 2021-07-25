// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITokenPresenter.sol";
import "./utils/Maintainable.sol";

contract TokenPresenter is ITokenPresenter, Maintainable {

  address public token;

  constructor() {
    token = address(0);
  }

  function setToken(address token_) onlyOwner public {
    require(token_ != address(0), "OrosToken: address to the zero address");
    token = token_;
  }

  function receiveTokens(address, address to_, uint256 value_) public override returns (bool) {
    ifNotMaintenance();
    require(msg.sender == token, "OrosPresenter: Only trigger from token");
    IERC20 erc20 = IERC20(token);
    erc20.transfer(to_, value_);
    return true;
  }

  function getEthBalance() public view onlyOwner returns (uint) {
    return address(this).balance;
  }

  function withdrawEthBalance() external onlyOwner {
    payable(owner()).transfer(getEthBalance());
  }

  function getTokenBalance(address _tokenAddress) public view onlyOwner returns (uint) {
    IERC20 erc20 = IERC20(_tokenAddress);
    return erc20.balanceOf(address(this));
  }

  function withdrawTokenBalance(address _tokenAddress) external onlyOwner {
    IERC20 erc20 = IERC20(_tokenAddress);
    erc20.transfer(
      owner(),
      getTokenBalance(_tokenAddress)
    );
  }
}
