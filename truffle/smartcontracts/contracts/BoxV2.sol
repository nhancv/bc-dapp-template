// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BoxV2 is Initializable {
    // ... code from Box.sol
    uint256 private value;

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

    // Upgrading limitation
    // Due to technical limitations, when you upgrade a contract to a new version you cannot change the storage layout of that contract.
    // This means that, if you have already declared a state variable in your contract, you cannot remove it,
    // change its type, or declare another variable before it.
    // In our Box example, it means that we can only add new state variables after value.
    //----
    // NEW
    // Increments the stored value by 1
    function increment() public {
        value = value + 1;
        emit ValueChanged(value);
    }
}