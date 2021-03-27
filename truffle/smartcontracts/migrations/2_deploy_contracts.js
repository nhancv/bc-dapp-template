const CryptoLott = artifacts.require("CryptoLott");
const UniqueAsset = artifacts.require("UniqueAsset");

module.exports = function(deployer) {
  deployer.deploy(CryptoLott);
  deployer.deploy(UniqueAsset);
};
