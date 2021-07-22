/*
truffle migrate -f 1 --to 1 --network bscTestnet
truffle run verify Migration --network bscTestnet

truffle migrate -f 1 --to 1 --network bscMainnet
truffle run verify Migration --network bscMainnet
 */
const fromExponential = require('from-exponential');
const ethers = require('ethers');
const moment = require('moment');
const BN = web3.utils.BN;

const Migration = artifacts.require("Migration");
const ERC20Token = artifacts.require("ERC20Token.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  console.log('Owner:', owner);
  await deployer.deploy(Migration);
  const instanceMigration = await Migration.deployed();
  await deployer.deploy(ERC20Token, "Nhan Cao", "nhancv", 18, 777999777);
  const instanceToken = await ERC20Token.deployed();
  await instanceMigration.setCompleted(instanceToken.address);
};
