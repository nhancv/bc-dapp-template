// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

interface ITokenPresenter {
  function receiveTokens(address _from, address _to, uint256 _value) external returns (bool);
}