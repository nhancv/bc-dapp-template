/*
truffle migrate -f 1 --to 1 --network bscTestnet
truffle run verify Migration --network bscTestnet

truffle migrate -f 1 --to 1 --network bscMainnet
truffle run verify Migration --network bscMainnet
 */
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const fromExponential = require('from-exponential');
const ethers = require('ethers');
const moment = require('moment');
const BN = web3.utils.BN;

const Migration = artifacts.require('Migration');
const ERC20Token = artifacts.require('ERC20Token');

module.exports = async function (deployer, network, accounts) {
  if (network === 'test') return;
  const owner = accounts[0];
  console.log('Owner:', owner);
  /// Deploy migration normally
  await deployer.deploy(Migration);
  const instanceMigration = await Migration.deployed();

  /// Deploy token upgradeable
  await deployProxy(ERC20Token, ['Nhan Cao', 'nhancv', 18, 777999777], {
    deployer: deployer,
    initializer: '__ERC20Token_init',
  });
  const instanceToken = await ERC20Token.deployed(); // TransparentUpgradeableProxy address
  // const instanceToken = await ERC20Token.at('0xcBCcC89033b7B1D6678E51c3d1d0Ba6C1ace9Ae2');
  console.log('Token:', instanceToken.address);
  console.log('Token owner:', await instanceToken.owner());

  /// Update migration completed
  await instanceMigration.setCompleted(instanceToken.address);
};
