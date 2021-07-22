// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Box is Initializable {
    uint256 internal value;

    // upgradeable
    function initialize(uint256 _x) public initializer {
        value = _x;
    }

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
