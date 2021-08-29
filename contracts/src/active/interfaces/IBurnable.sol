// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

interface IBurnable {
  function burn(uint amount) external;
  function burnFrom(address account, uint amount) external;
}
