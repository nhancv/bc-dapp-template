/*
truffle migrate -f 0 --to 0 --network bscTestnet --reset
truffle run verify Box@0x4DE65E961A8A19C2edb057c3ce5Dd3BD3Fe915d4 --network bscTestnet
truffle run verify BoxV2@0x5E707415282bA9211f2e4E15eE5c4300d04E5F48 --network bscTestnet

truffle migrate -f 0 --to 0 --network bscMainnet --reset
truffle run verify Box BoxV2 --network bscMainnet
 */
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const fromExponential = require('from-exponential');
const ethers = require('ethers');
const moment = require('moment');
const BN = web3.utils.BN;

const Box = artifacts.require('Box');
const BoxV2 = artifacts.require('BoxV2');

module.exports = async function (deployer, network, accounts) {
  // Deploy box
  // Create a proxy, and initialize it by calling initialize(42)
  await deployProxy(Box, [42], { deployer: deployer, initializer: '__Box_init' });
  const instanceBoxV1 = await Box.deployed(); // TransparentUpgradeableProxy address
  // const instance = await Box.at('0x337834DCA5B10b49f2456E0B70F4C481DA81B7d7');
  console.log('BoxV1:', instanceBoxV1.address);
  console.log('BoxV1 owner: ', await instanceBoxV1.owner());
  // Upgrade box
  await upgradeProxy(instanceBoxV1.address, BoxV2, { deployer: deployer });
  const instanceBoxV2 = await BoxV2.deployed(); // Same address of TransparentUpgradeableProxy
  console.log('BoxV2:', instanceBoxV2.address);
  console.log('BoxV2 owner:', await instanceBoxV2.owner());
};
