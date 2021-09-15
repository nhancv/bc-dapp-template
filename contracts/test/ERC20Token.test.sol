// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/active/ERC20Token.sol";

contract ERC20TokenTest {
  // truffle test ./test/ERC20Token.test.sol
  function testInitialBalanceUsingDeployedContract() public {
    ERC20Token meta = ERC20Token(DeployedAddresses.ERC20Token());

    uint expected = 777999777000000000000000000;

    Assert.equal(meta.totalSupply(), expected, "Owner should have 777999777000000000000000000 ERC20Token initially");
  }

  // truffle test ./test/ERC20Token.test.sol --network test
  function testInitialBalanceWithNewERC20Token() public {
    ERC20Token meta = new ERC20Token();
    meta.__ERC20Token_init("Nhan Cao", "nhancv", 18, 777999777);

    uint expected = 777999777000000000000000000;

    Assert.equal(
      meta.balanceOf(meta.owner()),
      expected,
      "Owner should have 777999777000000000000000000 ERC20Token initially"
    );
  }
}
