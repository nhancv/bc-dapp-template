// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract AntiWhale is OwnableUpgradeable {
  uint256 public startDate;
  uint256 public endDate;
  uint256 public limitWhale;
  bool public antiWhaleActivated;

  /**
   * @dev activate antiwhale
   */
  function activateAntiWhale() public onlyOwner {
    require(antiWhaleActivated == false, "Already activated");
    antiWhaleActivated = true;
  }

  /**
   * @dev deactivate antiwhale
   */
  function deActivateAntiWhale() public onlyOwner {
    require(antiWhaleActivated == true, "Already activated");
    antiWhaleActivated = false;
  }

  /**
   * @dev set antiwhale settings
   * @param _startDate start date of the antiwhale
   * @param _endDate end date of the antiwhale
   * @param _limitWhale limit amount of antiwhale
   */
  function setAntiWhale(
    uint256 _startDate,
    uint256 _endDate,
    uint256 _limitWhale
  ) public onlyOwner {
    startDate = _startDate;
    endDate = _endDate;
    limitWhale = _limitWhale;
    antiWhaleActivated = true;
  }

  /**
   * @dev check if antiwhale is enable and amount should be less than to whale in specify duration
   * @param _from from address
   * @param _to to address
   * @param _amount amount to check antiwhale
   */
  function isWhale(
    address _from,
    address _to,
    uint256 _amount
  ) public view returns (bool) {
    if (_from == owner() || _to == owner() || antiWhaleActivated == false || _amount <= limitWhale) return false;

    if (block.timestamp >= startDate && block.timestamp <= endDate) return true;

    return false;
  }
}
