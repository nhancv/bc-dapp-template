import Web3 from 'web3';

const cryptoLottSol = require('./abis/CryptoLott.json');

type FunctionHash = (hash: any) => void;

export type Player = {
  playerAddress: string;
  playerName: string;
  playerNumbers: number[];
};

export default class CryptoLottContract {
  web3: Web3;
  account: string;
  contract: any;
  contractAddress: string | undefined;

  constructor(web3: any, account: any, contractAddress: string) {
    this.web3 = web3;
    this.account = account;
    this.initContract(contractAddress);
  }

  viewBalance(account?: string) {
    return this.web3.eth.getBalance(account ? account : this.account);
  }

  initContract(contractAddress: string) {
    if (contractAddress) {
      this.contractAddress = contractAddress;
      this.contract = new this.web3.eth.Contract(cryptoLottSol.abi, this.contractAddress);
    }
  }

  trackingEvent(cb?: any): any {
    this.contract.events.allEvents({}, (error: any, event: any) => {
      console.log(event.event, event);
      if (cb) {
        cb(error, event);
      }
    });
  }

  getMinPrice(): Promise<number> {
    return this.contract.methods.getMinPrice().call();
  }

  getCountPlayer(): Promise<number> {
    return this.contract.methods.getCountPlayer().call();
  }

  getMaxPlayer(): Promise<number> {
    return this.contract.methods.getMaxPlayer().call();
  }

  getMaxLuckyRandomNumber(): Promise<number> {
    return this.contract.methods.getMaxLuckyRandomNumber().call();
  }

  getLastTotalFund(): Promise<number> {
    return this.contract.methods.getLastTotalFund().call();
  }

  getLastLuckyNumber(): Promise<number> {
    return this.contract.methods.getLastLuckyNumber().call();
  }

  getCurrentFund(): Promise<number> {
    return this.contract.methods.getCurrentFund().call();
  }

  getCharityAddress(): Promise<string> {
    return this.contract.methods.getCharityAddress().call();
  }

  getOwnerAddress(): Promise<string> {
    return this.contract.methods.getOwnerAddress().call();
  }

  getPlayerInfo(playerAddress: string): Promise<any> {
    return this.contract.methods.getPlayerInfo(playerAddress).call();
  }

  // Owner only
  ownerUpCharityAddress(charityAddress: string, transactionHash?: FunctionHash): Promise<any> {
    return this.contract.methods
      .upCharityAddress(charityAddress)
      .send({ from: this.account })
      .on('transactionHash', (hash: any) => {
        if (transactionHash) transactionHash(hash);
      });
  }

  ownerEnableContract(status: boolean, transactionHash?: FunctionHash): Promise<any> {
    return this.contract.methods
      .enableContract(status)
      .send({ from: this.account })
      .on('transactionHash', (hash: any) => {
        if (transactionHash) transactionHash(hash);
      });
  }

  ownerConfig(
    minPrice: number,
    maxPlayerRandom: number,
    maxLuckyNumberRandom: number,
    charityRate: number,
    winnerRate: number,
    transactionHash?: FunctionHash,
  ): Promise<any> {
    return this.contract.methods
      .config(minPrice, maxPlayerRandom, maxLuckyNumberRandom, charityRate, winnerRate)
      .send({ from: this.account })
      .on('transactionHash', (hash: any) => {
        if (transactionHash) transactionHash(hash);
      });
  }

  playerRegister(name: string, numbers: number[], value: number, transactionHash?: FunctionHash) {
    return this.contract.methods
      .playerRegister(name, numbers)
      .send({ from: this.account, value })
      .on('transactionHash', (hash: any) => {
        if (transactionHash) transactionHash(hash);
      })
      .on('confirmation', (confirmationNumber: string, receipt: any) => {
        console.log('=> confirmation: ' + confirmationNumber);
      })
      .on('receipt', (receipt: any) => {
        console.log('=> reciept', receipt);
      })
      .on('error', (error: any) => {
        console.error('Error: ', error);
      });
  }
}
