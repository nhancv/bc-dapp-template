// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Box.sol";

contract BoxV2 is Box {

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
