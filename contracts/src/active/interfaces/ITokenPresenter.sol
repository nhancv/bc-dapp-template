// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ITokenPresenter {
  function receiveTokens(
    address _trigger,
    address _from,
    address _to,
    uint256 _amount
  ) external returns (bool);
}
