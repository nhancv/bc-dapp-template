/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockGasLimit: 80000000,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20,
        accountsBalance: "1000000000000000000000000"
      },
      mining: {
        auto: true,
        interval: [1000, 2000]
      }
    }
  },
  solidity: "0.8.4"
};
