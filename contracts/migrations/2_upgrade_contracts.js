/*
truffle migrate -f 2 --to 2 --network bscTestnet
truffle run verify Migration --network bscTestnet

truffle migrate -f 2 --to 2 --network bscMainnet
truffle run verify Migration --network bscMainnet
 */
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const fromExponential = require('from-exponential');
const ethers = require('ethers');
const moment = require('moment');
const BN = web3.utils.BN;

const ERC20Token = artifacts.require('ERC20Token');

module.exports = async function (deployer, network, accounts) {
  if (network === 'test') return;
  const owner = accounts[0];
  console.log('Owner:', owner);

  /// Upgrade token upgradeable
  let instanceToken = await ERC20Token.at('0xbb58dcdEe34B0De5EBfb0A19D58dBa905f8F4f1f');
  await upgradeProxy(instanceToken.address, ERC20Token, { deployer: deployer });
  instanceToken = await ERC20Token.deployed(); // TransparentUpgradeableProxy address
  console.log('Token:', instanceToken.address);
  console.log('Token owner:', await instanceToken.owner());
};
