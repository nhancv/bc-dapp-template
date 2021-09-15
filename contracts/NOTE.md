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

- Create `.env` file, put MNEMONIC and <network>\_URL to file

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
truffle run verify ERC20Token@0x4031B139faFfD14119F142A75c2d04aDB15C5c81 --network bscTestnet

=> You should see the following output:
Verifying ERC20Token@0x4031B139faFfD14119F142A75c2d04aDB15C5c81
Pass - Verified: https://testnet.bscscan.com/address/0x4031B139faFfD14119F142A75c2d04aDB15C5c81#contracts
Successfully verified 1 contract(s).
```

## Flat Contract to one contract .sol file

Truffle Flattener concats solidity files from Truffle with all of their dependencies.
https://www.npmjs.com/package/truffle-flattener

```
# Install
npm install truffle-flattener -g

# Usage: Just intall it with npm in your truffle project and run
truffle-flattener <solidity-files>.

# Limitations: Aliased imports (eg: import {symbol1 as alias, symbol2} from "filename";) are not supported by truffle-flattener.
```

> Flatten with https://www.npmjs.com/package/sol-merger
>
> npm install sol-merger -g
> sol-merger "src/active/ERC20Token.sol"
> sol-merger --export-plugin SPDXLicenseRemovePlugin "src/active/ERC20Token.sol"

> Flatten with hardhat
>
> npx hardhat flatten "src/active/ERC20Token.sol" > ERC20Token_flat.sol

## Max contract size

https://soliditydeveloper.com/max-contract-size

```
npm install truffle-contract-size
Add the plugin to the truffle-config.js: plugins: ["truffle-contract-size"]
Run truffle run contract-size
```

## Example development script

```
Terminal 1:
# local blockchain
ganache-cli -p 7545
# fork bsc to local
ganache-cli --fork https://data-seed-prebsc-1-s1.binance.org:8545
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

truffle(rinkeby)> await nft.tokenURI(1)
'this is data'

truffle(rinkeby)> await nft.ownerOf(1)
'0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79'

truffle(rinkeby)> await nft.getApproved(1)
'0x0000000000000000000000000000000000000000'

truffle(rinkeby)> await nft.balanceOf('0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79')
BN { negative: 0, words: [ 1, <1 empty item> ], length: 1, red: null }

truffle(rinkeby)> await nft.awardItem('0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645', '2', 'this is data2')

truffle(rinkeby)> await nft.ownerOf(2)
'0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645'

truffle(rinkeby)> await nft.awardItem('0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645', '3', 'this is data3')

truffle(rinkeby)> await nft.transferFrom('0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645', '0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79', 2)

truffle(rinkeby)> await nft.ownerOf(1)
'0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79'
truffle(rinkeby)> await nft.ownerOf(2)
'0x00622d8992F4EdDF11cCe23Fe19C2d972F580c79'
truffle(rinkeby)> await nft.ownerOf(3)
'0xFd0c67EDD5e4cE03cd8397Dc748b19b0A5c0f645'
```

- After mint the first item, we can check on Opensea

```
- Fill Contract address here: https://testnets.opensea.io/get-listed/step-two
- Submit and check
https://testnets.opensea.io/collection/uniqueasset-vyjy4xjs1x
```
