pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CryptoLott.sol";

contract TestBeeSightSoft {

  function testInitialBalanceUsingDeployedContract() public {
    CryptoLott meta = CryptoLott(DeployedAddresses.BeeSightSoft());

    uint expected = 1000000000;

    Assert.equal(meta.totalSupply(), expected, "Owner should have 1000000000 CryptoLott initially");
  }

  function testInitialBalanceWithNewBeeSightSoft() public {
    CryptoLott meta = new CryptoLott();

    uint expected = 1000000000;
   
    Assert.equal(meta.balanceOf(meta.owner()), expected, "Owner should have 1000000000 CryptoLott initially");
  }

}
