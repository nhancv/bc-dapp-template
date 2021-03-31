// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ERC20Token.sol";

contract TestERC20Token {

    function testInitialBalanceUsingDeployedContract() public {
        // nhancv is ERC20Token
        nhancv meta = nhancv(DeployedAddresses.nhancv());

        uint expected = 1000000000000000;

        Assert.equal(meta.totalSupply(), expected, "Owner should have 1000000000000000 ERC20Token initially");
    }

    function testInitialBalanceWithNewERC20Token() public {
        ERC20Token meta = new nhancv();

        uint expected = 1000000000000000;

        Assert.equal(meta.balanceOf(meta.owner()), expected, "Owner should have 1000000000000000 ERC20Token initially");
    }

}
