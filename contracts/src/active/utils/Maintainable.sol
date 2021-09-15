// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Maintainable is OwnableUpgradeable {
  bool public isMaintenance;
  bool public isOutdated;

  // Check if contract is not in maintenance
  function ifNotMaintenance() internal view {
    require(!isMaintenance, "Maintenance");
    require(!isOutdated, "Outdated");
  }

  // Check if contract on maintenance for restore
  function ifMaintenance() internal view {
    require(isMaintenance, "!Maintenance");
  }

  // Enable maintenance
  function enableMaintenance(bool status) public onlyOwner {
    isMaintenance = status;
  }

  // Enable outdated
  function enableOutdated(bool status) public onlyOwner {
    isOutdated = status;
  }
}
