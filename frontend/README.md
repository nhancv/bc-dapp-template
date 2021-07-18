## Prerequisite
- Node: 8.16.0
- Npm: 6.4.1
- Web3: 1.0.0-beta.33

## Install Metamask and Unlock

## Build Frontend
```
cd frontend
npm install --legacy-peer-deps
npm start

Go to: http://localhost:3000/
```

## Release Frontend
```
cd frontend
npm run build
```

----

## Works with web3

### How to use web3 to connect wallet on frontend?
- Install web3: https://www.npmjs.com/package/web3
- Example request connect Metamask wallet:

```
import Web3 from 'web3';

const connectMetamask = async () => {

  // Check metamask is install or not
  if (window.ethereum) {
    const provider = await detectEthereumProvider();
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      window.web3 = new Web3(provider);
    } else {
      window.web3 = new Web3(window.ethereum);
    }

    return window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(async () => {
        const chainId = window.ethereum.chainId;
        const accounts = await window.web3.eth.getAccounts();
        const balance = await window.web3.eth.getBalance(accounts[0]);
        // connectWalletSuccess
       	console.log(`chainId: ${chainId}; account: ${accounts[0]}; balance: ${balance}`);
      })
      .catch((error) => {
      	// connectWalletFail
      	console.error(error);
      });
  }

  return new Promise((resolve, reject) => {
    const err = 'Metamask not install.';

    resolve(err);
    // connectWalletFail
  });
};
```

### Deal with read method from contract?
- After initialized web3, create contract instance
```
const contract = new web3.eth.Contract(contractABI, contractAddress);
```

- Call the contract method
```
const minPrice = await contract.methods['getMinPrice']().call();
```

### Deal with write method from contract?
- Write method is any method which need to make transaction, and it takes a fee.
- Call write method without send ETH value
```
contract.methods
      .enableContract(status)
      .send({from: account})
      .on('transactionHash', hash => {
        // console.log('=> hash: ' + hash)
      });
```
- Call write method required send ETH like exchange.
```
contract.methods
      .playerRegister(name, numbers)
      .send({from: accountAddress, value: value})
      .on('transactionHash', hash => {
        // console.log('=> hash: ' + hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        // console.log('=> confirmation: ' + confirmationNumber)
      })
      .on('receipt', receipt => {
        // console.log('=> reciept', receipt)
      })
      .on('error', error => {
        // console.error('Error: ', error)
      })

```

### How to update realtime contract status?
- Listen all event emitted from smart contract, then update the detail
```
  trackingEvent(cb?): any {
    contract.events.allEvents({}, (error, event) => {
      // console.log(event.event, event);
      if (cb) {
        cb(error, event);
      }
    });
  }
```





