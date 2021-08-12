// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITokenPresenter.sol";
import "./utils/Maintainable.sol";

contract TokenPresenter is ITokenPresenter, Maintainable {

  address public token;

  event Received(address sender, uint amount);

  constructor() {
    token = address(0);
  }

  /**
  * @dev allow contract to receive ethers
  */
  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  /**
  * @dev set the main token
  * @param _token address of main token
  */
  function setToken(address _token) onlyOwner public {
    token = _token;
  }

  /**
  * @dev this is the main function to distribute the tokens call from only main token
  * @param _from from address
  * @param _to to address
  * @param _amount amount of tokens
  */
  function receiveTokens(address _from, address _to, uint256 _amount) public override returns (bool) {
    return receiveTokensFrom(_from, _from, _to, _amount);
  }

  /**
  * @dev this is the main function to distribute the tokens call from only main token via external app
  * @param _trigger trigger address
  * @param _from from address
  * @param _to to address
  * @param _amount amount of tokens
  */
  function receiveTokensFrom(address _trigger, address _from, address _to, uint256 _amount) public override returns (bool) {
    ifNotMaintenance();
    require(msg.sender == token, "TokenPresenter: Only trigger from token");
    IERC20(token).transfer(_to, _amount);
    return true;
  }

  /**
  * @dev get the eth balance on the contract
  * @return eth balance
  */
  function getEthBalance() public view onlyOwner returns (uint) {
    return address(this).balance;
  }

  /**
  * @dev withdraw eth balance
  */
  function withdrawEthBalance() external onlyOwner {
    payable(owner()).transfer(getEthBalance());
  }

  /**
  * @dev get the token balance
  * @param _tokenAddress token address
  */
  function getTokenBalance(address _tokenAddress) public view onlyOwner returns (uint) {
    IERC20 erc20 = IERC20(_tokenAddress);
    return erc20.balanceOf(address(this));
  }

  /**
  * @dev withdraw token balance
  * @param _tokenAddress token address
  */
  function withdrawTokenBalance(address _tokenAddress) external onlyOwner {
    IERC20 erc20 = IERC20(_tokenAddress);
    erc20.transfer(
      owner(),
      getTokenBalance(_tokenAddress)
    );
  }
}
