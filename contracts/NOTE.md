## [For local deployment] Development env
- Option1: Install Ganache -> Start Ganache and create new project by point to `truffle-config.js` file
- Option2: Install Ganache Cli: https://github.com/trufflesuite/ganache-cli

## For auto publish and verify contract

Docs:
- https://forum.openzeppelin.com/t/verify-smart-contract-inheriting-from-openzeppelin-contracts/4119
- https://github.com/rkalis/truffle-plugin-verify#readme
- https://docs.binance.org/smart-chain/developer/deploy/truffle-verify.html

## [For Ethereum] Get Web3 Api key from Infura.io Real network
- Register new account on infura.io
- Create new project
- Get project api and connection link:
```
ROPSTEN_URL=https://ropsten.infura.io/v3/<your-api-key>
KOVAN_URL=https://kovan.infura.io/v3/<your-api-key>
RINKEBY_URL=https://rinkeby.infura.io/v3/<your-api-key>
MAINNET_URL=https://mainnet.infura.io/v3/<your-api-key>
```

## Preparing deployment configuration
- Go to Truffle project, install node libs
```
npm install truffle-hdwallet-provider --save
npm install bip39 dotenv --save
npm install truffle-plugin-verify

# where
* bip39 – used to generate wallet mnemonic
* dotenv – simple way to read environment variable files
```
- Generate MNEMONIC words
```
node -e "console.log(require('bip39').generateMnemonic())"
```
- Create `.env` file, put MNEMONIC and <network>_URL to file
```
MNEMONIC=wallet mnemonic 12 words
ROPSTEN_URL=https://ropsten.infura.io/v3/<your-api-key>
KOVAN_URL=https://kovan.infura.io/v3/<your-api-key>
RINKEBY_URL=https://rinkeby.infura.io/v3/<your-api-key>
MAINNET_URL=https://mainnet.infura.io/v3/<your-api-key>
ETHERSCANAPI_KEY=<from https://etherscan.io>
BSCSCANAPI_KEY=<from https://bscscan.com>
```
- Update truffle-config.js file
```
require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')
const MNEMONIC = process.env.MNEMONIC
const ROPSTEN_URL = process.env.ROPSTEN_URL
const KOVAN_URL = process.env.KOVAN_URL
const RINKEBY_URL = process.env.RINKEBY_URL
const MAINNET_URL = process.env.MAINNET_URL
const ETHERSCANAPI_KEY = process.env.ETHERSCANAPI_KEY
const BSCSCANAPI_KEY = process.env.BSCSCANAPI_KEY

module.exports = {

  contracts_directory: "./contracts/active",
  contracts_build_directory: "./contracts/abis",

  networks: {

    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      websockets: true
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      websockets: true
    },
    ropsten: {
      provider: () => new HDWalletProvider(MNEMONIC, ROPSTEN_URL),
      network_id: 3
    },
    kovan: {
      provider: () => new HDWalletProvider(MNEMONIC, KOVAN_URL),
      network_id: 42
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, RINKEBY_URL),
      network_id: 4
    },
    // main ethereum network(mainnet)
    mainnet: {
      provider: () => new HDWalletProvider(MNEMONIC, MAINNET_URL),
      network_id: 1
    },
    // bsc test net
    bscTestnet:{
      provider: () => new HDWalletProvider(MNEMONIC, "https://data-seed-prebsc-1-s1.binance.org:8545"),
      network_id: 97,
    },
    // bsc main net
    bscMainnet: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://bsc-dataseed.binance.org"),
      network_id: 56
    },
  },

  // Auto publish and verify contract
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: ETHERSCANAPI_KEY,
    bscscan: BSCSCANAPI_KEY
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: ">=0.6.0 <=0.8.4", 
    }
  },

  // Truffle DB is currently disabled by default;
  db: {
    enabled: false
  }
};

```

- To get public wallet address
```
truffle console --network <network>
truffle(ropsten)> web3.eth.getAccounts((err, accounts) => console.log(accounts))
eg:
truffle console --network ropsten
truffle(ropsten)> web3.eth.getAccounts((err, accounts) => console.log(accounts))
[ '0x627306090abab3a6e1400e9345bc60c78a8bef57' ]
``` 

- Prepare some eth/bsc from test network faucet
```
https://faucet.metamask.io/
https://faucet.ropsten.be/
https://faucet.metamask.io/
http://faucet.bitfwd.xyz/
https://testnet.binance.org/faucet-smart
```

## Deploy a contract to the network

- Remove old build api built files
- Run migrate
```
# For local network
truffle migrate

# Fow specific network
truffle migrate --network <network>
eg: 
truffle migrate --network ropsten
truffle migrate --network mainnet

# Compile & Migrate contract only (Replace if exist and Deploy for new one)
truffle migrate -f 2 --network ropsten

# Compile & Deploy new contract (not replace) 
truffle migrate -f 1 --network bscTestnet
```

## Publish & Verify Contract

```
truffle run verify {contract_class_name}@{contract_address} --network <network_name>

* Note: if your just deploy one one {contract_class_name}, you can remove @{contract_address} when verify
truffle run verify {contract_class_name} --network <network_name>

Ex:
truffle run verify LaunchX@0x4031B139faFfD14119F142A75c2d04aDB15C5c81 --network bscTestnet

=> You should see the following output:
Verifying LaunchX@0x4031B139faFfD14119F142A75c2d04aDB15C5c81
Pass - Verified: https://testnet.bscscan.com/address/0x4031B139faFfD14119F142A75c2d04aDB15C5c81#contracts
Successfully verified 1 contract(s).
```

## Flat Contract to one contract .sol file

Truffle Flattener concats solidity files from Truffle with all of their dependencies.
https://www.npmjs.com/package/truffle-flattener

> Another option is https://www.npmjs.com/package/sol-merger
> 
> npm install sol-merger -g

```
# Install
npm install truffle-flattener -g

# Usage: Just intall it with npm in your truffle project and run 
truffle-flattener <solidity-files>.

# Limitations: Aliased imports (eg: import {symbol1 as alias, symbol2} from "filename";) are not supported by truffle-flattener.
```

## Max contract size

https://soliditydeveloper.com/max-contract-size

```
npm install truffle-contract-size
Add the plugin to the truffle-config.js: plugins: ["truffle-contract-size"]
Run truffle run contract-size
```

## Example development script
```
Terminal 1: ganache-cli -p 7545
Terminal 2: 
# local
truffle migrate -f 1
# bsc testnet
truffle migrate -f 2 --to 2 --network bscTestnet
truffle run verify ERC20Token --network bscTestnet

# To mainnet
truffle migrate -f 2 --to 2 --network bscMainnet
truffle run verify ERC20Token --network bscMainnet
```

## Deploy ERC721 contract on public testnet Rinkeby
```
# Compile
truffle compile

# Deploy and Award item
truffle console --network rinkeby
truffle(rinkeby)> accounts
[ '0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645' ]
truffle(rinkeby)> migrate
truffle(rinkeby)> nft = await UniqueAsset.deployed()
undefined
truffle(rinkeby)> nft.address
'0xBbbFbC5514c3F9C85fDa0F3052530e32895f8EC4'
truffle(rinkeby)> await nft.name()
'UniqueAsset'
truffle(rinkeby)> await nft.symbol()
'UNA'

truffle(rinkeby)> await nft.awardItem('0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79', '1', 'this is data')
{
  tx: '0xbddb9aef085b3a0a0968e80319c91f07ad33b486b72887b68926674df768ef31',
  receipt: {
    blockHash: '0xb6a434cdfde1aa88c8a4d2cd5a174861c3c2aa430bcbe801e9c9569f4efb132a',
    blockNumber: 8307078,
    contractAddress: null,
    cumulativeGasUsed: 139730,
    from: '0xfd0c67edd5e4ce03cd8397dc748b19b0a5c0f645',
    gasUsed: 139730,
    logs: [ [Object] ],
    logsBloom: '0x00000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000008000000000000000000040000000000000000000000000000020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000100000000000500000000080000060000000000000000000000000000400000000000000000000000000000000000000',
    status: true,
    to: '0xbbbfbc5514c3f9c85fda0f3052530e32895f8ec4',
    transactionHash: '0xbddb9aef085b3a0a0968e80319c91f07ad33b486b72887b68926674df768ef31',
    transactionIndex: 0,
    type: '0x0',
    rawLogs: [ [Object] ]
  },
  logs: [
    {
      address: '0xBbbFbC5514c3F9C85fDa0F3052530e32895f8EC4',
      blockHash: '0xb6a434cdfde1aa88c8a4d2cd5a174861c3c2aa430bcbe801e9c9569f4efb132a',
      blockNumber: 8307078,
      logIndex: 0,
      removed: false,
      transactionHash: '0xbddb9aef085b3a0a0968e80319c91f07ad33b486b72887b68926674df768ef31',
      transactionIndex: 0,
      id: 'log_78f0cc63',
      event: 'Transfer',
      args: [Result]
    }
  ]
}

truffle(rinkeby)> await nft.tokenURI(1)
'this is data'

truffle(rinkeby)> await nft.ownerOf(1)
'0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79'

truffle(rinkeby)> await nft.getApproved(1)
'0x0000000000000000000000000000000000000000'

truffle(rinkeby)> await nft.balanceOf('0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79')
BN { negative: 0, words: [ 1, <1 empty item> ], length: 1, red: null }

truffle(rinkeby)> await nft.awardItem('0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645', '2', 'this is data2')
{
  tx: '0x903c9fc3450b8453255f1b3254b6e985cf7e70675222c2d839899b75b09db591',
  receipt: {
    blockHash: '0x8f16dd2a6df3e77132fe5615586eb2b57a66f66b8553f633c76312727b8dd21a',
    blockNumber: 8307266,
    contractAddress: null,
    cumulativeGasUsed: 152040,
    from: '0xfd0c67edd5e4ce03cd8397dc748b19b0a5c0f645',
    gasUsed: 123007,
    logs: [ [Object] ],
    logsBloom: '0x04000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000008000000000000000000000000000000000000000000000010020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000002000000000000000000000000100000000000100000000080000020000000000000000400000000000000000000000000008000000000000000000000',
    status: true,
    to: '0xbbbfbc5514c3f9c85fda0f3052530e32895f8ec4',
    transactionHash: '0x903c9fc3450b8453255f1b3254b6e985cf7e70675222c2d839899b75b09db591',
    transactionIndex: 1,
    type: '0x0',
    rawLogs: [ [Object] ]
  },
  logs: [
    {
      address: '0xBbbFbC5514c3F9C85fDa0F3052530e32895f8EC4',
      blockHash: '0x8f16dd2a6df3e77132fe5615586eb2b57a66f66b8553f633c76312727b8dd21a',
      blockNumber: 8307266,
      logIndex: 0,
      removed: false,
      transactionHash: '0x903c9fc3450b8453255f1b3254b6e985cf7e70675222c2d839899b75b09db591',
      transactionIndex: 1,
      id: 'log_aa51b460',
      event: 'Transfer',
      args: [Result]
    }
  ]
}

truffle(rinkeby)> await nft.ownerOf(2)
'0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645'

truffle(rinkeby)> await nft.awardItem('0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645', '3', 'this is data3')
{
  tx: '0xee495104f2106d7e92987c4150c0127d8874a233ab1b30c8d473ebaf71cdad8a',
  receipt: {
    blockHash: '0x32bae033e6f5bdc8e0a7999a685e1767ab580cd88025ec0f959fe4cb62eb24dd',
    blockNumber: 8307273,
    contractAddress: null,
    cumulativeGasUsed: 105907,
    from: '0xfd0c67edd5e4ce03cd8397dc748b19b0a5c0f645',
    gasUsed: 105907,
    logs: [ [Object] ],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000020000000000000000000000000000000000000008000000000000000000000000000000000000000000000010020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000400000000002000000000000000000000000100000000000100000000080000020000000000000000400000000000000000000000000000000000000000000000000',
    status: true,
    to: '0xbbbfbc5514c3f9c85fda0f3052530e32895f8ec4',
    transactionHash: '0xee495104f2106d7e92987c4150c0127d8874a233ab1b30c8d473ebaf71cdad8a',
    transactionIndex: 0,
    type: '0x0',
    rawLogs: [ [Object] ]
  },
  logs: [
    {
      address: '0xBbbFbC5514c3F9C85fDa0F3052530e32895f8EC4',
      blockHash: '0x32bae033e6f5bdc8e0a7999a685e1767ab580cd88025ec0f959fe4cb62eb24dd',
      blockNumber: 8307273,
      logIndex: 0,
      removed: false,
      transactionHash: '0xee495104f2106d7e92987c4150c0127d8874a233ab1b30c8d473ebaf71cdad8a',
      transactionIndex: 0,
      id: 'log_86a03d0f',
      event: 'Transfer',
      args: [Result]
    }
  ]
}

truffle(rinkeby)> await nft.transferFrom('0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645', '0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79', 2)
{
  tx: '0xe541b4d58cffcadf9c27f467d3b7f13dd071c4cbe5c54ac081155fd106458c96',
  receipt: {
    blockHash: '0xfffee167981f12555f3094687f1463d5f2369fd2a53688b1d875f378155da2f5',
    blockNumber: 8307286,
    contractAddress: null,
    cumulativeGasUsed: 135871,
    from: '0xfd0c67edd5e4ce03cd8397dc748b19b0a5c0f645',
    gasUsed: 46340,
    logs: [ [Object], [Object] ],
    logsBloom: '0x04000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000020000000000200000000000000000000000000008000000000000000000000000000000000000000000000010020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000100000000000000000000000000000000000000000000000002000000000000000000000000100000000000500000000080000020000010000000000400000000000400000000000000008000000000000000000000',
    status: true,
    to: '0xbbbfbc5514c3f9c85fda0f3052530e32895f8ec4',
    transactionHash: '0xe541b4d58cffcadf9c27f467d3b7f13dd071c4cbe5c54ac081155fd106458c96',
    transactionIndex: 2,
    type: '0x0',
    rawLogs: [ [Object], [Object] ]
  },
  logs: [
    {
      address: '0xBbbFbC5514c3F9C85fDa0F3052530e32895f8EC4',
      blockHash: '0xfffee167981f12555f3094687f1463d5f2369fd2a53688b1d875f378155da2f5',
      blockNumber: 8307286,
      logIndex: 3,
      removed: false,
      transactionHash: '0xe541b4d58cffcadf9c27f467d3b7f13dd071c4cbe5c54ac081155fd106458c96',
      transactionIndex: 2,
      id: 'log_54c2d809',
      event: 'Approval',
      args: [Result]
    },
    {
      address: '0xBbbFbC5514c3F9C85fDa0F3052530e32895f8EC4',
      blockHash: '0xfffee167981f12555f3094687f1463d5f2369fd2a53688b1d875f378155da2f5',
      blockNumber: 8307286,
      logIndex: 4,
      removed: false,
      transactionHash: '0xe541b4d58cffcadf9c27f467d3b7f13dd071c4cbe5c54ac081155fd106458c96',
      transactionIndex: 2,
      id: 'log_15cbe71d',
      event: 'Transfer',
      args: [Result]
    }
  ]
}

truffle(rinkeby)> await nft.ownerOf(1)
'0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79'
truffle(rinkeby)> await nft.ownerOf(2)
'0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79'
truffle(rinkeby)> await nft.ownerOf(3)
'0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645'
```

* After mint the first item, we can check on Opensea

```
- Fill Contract address here: https://testnets.opensea.io/get-listed/step-two
- Submit and check
https://testnets.opensea.io/collection/uniqueasset-vyjy4xjs1x
```
