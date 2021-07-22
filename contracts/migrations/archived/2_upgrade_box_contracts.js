/*
truffle migrate -f 2 --to 2 --network bscTestnet
truffle run verify Box BoxV2 --network bscTestnet

truffle migrate -f 2 --to 2 --network bscMainnet
truffle run verify Box BoxV2 --network bscMainnet
 */
const {deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');
const fromExponential = require('from-exponential');
const ethers = require('ethers');
const moment = require('moment');
const BN = web3.utils.BN;

const Box = artifacts.require('Box');
const BoxV2 = artifacts.require('BoxV2');

module.exports = async function (deployer, network, accounts) {
  // Deploy box
  // Create a proxy, and initialize it by calling initialize(42)
  await deployProxy(Box, [42], {deployer});
  const instance = await Box.deployed();
  // const instance = await Box.at('0x337834DCA5B10b49f2456E0B70F4C481DA81B7d7');
  console.log('Deployed', instance.address);
  // Upgrade box
  await upgradeProxy(instance.address, BoxV2, {deployer});
  const upgraded = await BoxV2.deployed();
  console.log("Upgraded", upgraded.address);
};
