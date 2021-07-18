const CryptoLott = artifacts.require("CryptoLott");
const UniqueAsset = artifacts.require("UniqueAsset");
const nhancv = artifacts.require("nhancv");

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(CryptoLott);
  deployer.deploy(UniqueAsset);
  deployer.deploy(nhancv);
};
