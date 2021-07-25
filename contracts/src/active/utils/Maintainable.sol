// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Maintainable is Ownable {

  bool public isMaintenance = false;
  bool public isOutdated = false;

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
  function enableMaintenance(bool status) onlyOwner public {
    isMaintenance = status;
  }

  // Enable outdated
  function enableOutdated(bool status) onlyOwner public {
    isOutdated = status;
  }

}

