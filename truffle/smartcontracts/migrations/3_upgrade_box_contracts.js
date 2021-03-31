const {deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');

const Box = artifacts.require('Box');
const BoxV2 = artifacts.require('BoxV2');

module.exports = async function (deployer, network, accounts) {
    // Deploy box
    // create a proxy, and initialize it by calling initialize(42)
    const instance = await deployProxy(Box, [42], {deployer});
    // const existing = await Box.deployed();
    console.log('Deployed', instance.address);
    // Upgrade box
    const upgraded = await upgradeProxy(instance.address, BoxV2, {deployer});
    console.log("Upgraded", upgraded.address);
};
