// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/active/ERC20Token.sol";

contract TestERC20Token {

  function testInitialBalanceUsingDeployedContract() public {
    // nhancv is ERC20Token
    ERC20Token meta = ERC20Token(DeployedAddresses.ERC20Token());

    uint expected = 777999777000000000000000000;

    Assert.equal(meta.totalSupply(), expected, "Owner should have 777999777000000000000000000 ERC20Token initially");
  }

  function testInitialBalanceWithNewERC20Token() public {
    ERC20Token meta = new ERC20Token("Nhan Cao", "nhancv", 18, 777999777);

    uint expected = 777999777000000000000000000;

    Assert.equal(meta.balanceOf(meta.owner()), expected, "Owner should have 777999777000000000000000000 ERC20Token initially");
  }

}
