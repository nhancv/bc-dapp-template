// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ITokenPresenter.sol";
import "./utils/Maintainable.sol";
import "./utils/EmergencyWithdraw.sol";

contract TokenPresenter is ITokenPresenter, EmergencyWithdraw, Maintainable {

  address public token;

  constructor() {
    token = address(0);
  }

  /**
  * @dev set the main token
  * @param _token address of main token
  */
  function setToken(address _token) onlyOwner public {
    token = _token;
  }

  /**
  * @dev this is the main function to distribute the tokens call from only main token via external app
  * @param _trigger trigger address
  * @param _from from address
  * @param _to to address
  * @param _amount amount of tokens
  */
  function receiveTokens(address _trigger, address _from, address _to, uint256 _amount) public override returns (bool) {
    ifNotMaintenance();
    require(msg.sender == token, "TokenPresenter: Only trigger from token");
    IERC20(token).transfer(_to, _amount);
    return true;
  }

}
