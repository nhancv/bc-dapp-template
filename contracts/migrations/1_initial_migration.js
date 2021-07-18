const Migrations = artifacts.require("Migrations");

module.exports = async (deployer, network, accounts) => {
  deployer.deploy(Migrations);
};
