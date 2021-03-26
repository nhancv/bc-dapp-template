import Web3 from 'web3'
import { Callback, EventLog } from 'web3/types';

const cryptoLottSol = require('./abi/CryptoLott.json')

export type Player = {
  playerAddress: string;
  playerName: string;
  playerNumbers: number[];
}

export default class CryptoLottContract {
  web3: Web3
  account: string
  contract: any
  contractAddress: string

  constructor(web3: any, account: any) {
    this.web3 = web3
    this.account = account
    this.initContract()
  }

  viewBalance(account?: string) {
    return this.web3.eth.getBalance(account ? account : this.account)
  }

  initContract(contractAddress: string = '0x716103d7CfC4D353Ba1a9a1D6D06bE1C0F803275') {
    this.contractAddress = contractAddress
    this.contract = new this.web3.eth.Contract(cryptoLottSol.abi, this.contractAddress)
  }

  trackingEvent(cb?: Callback<EventLog>): any {
    this.contract.events.allEvents({}, (error, event) => {
      // console.log(event.event, event);
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
  ownerUpCharityAddress(charityAddress: string, transactionHash?: Function): Promise<any> {
    return this.contract.methods.upCharityAddress(charityAddress)
      .send({from: this.account})
      .on('transactionHash', hash => {
        if (transactionHash) transactionHash(hash)
      });
  }

  ownerEnableContract(status: boolean, transactionHash?: Function): Promise<any> {
    return this.contract.methods.enableContract(status)
      .send({from: this.account})
      .on('transactionHash', hash => {
        if (transactionHash) transactionHash(hash)
      });
  }

  ownerConfig(minPrice: number, maxPlayerRandom: number, maxLuckyNumberRandom: number,
              charityRate: number, winnerRate: number, transactionHash?: Function): Promise<any> {
    return this.contract.methods.config(minPrice, maxPlayerRandom, maxLuckyNumberRandom,
      charityRate, winnerRate)
      .send({from: this.account})
      .on('transactionHash', hash => {
        if (transactionHash) transactionHash(hash)
      });
  }

  playerRegister(name: string, numbers: number[], value: number, transactionHash?: Function) {
    return this.contract.methods
      .playerRegister(name, numbers)
      .send({from: this.account, value: value})
      .on('transactionHash', hash => {
        if (transactionHash) transactionHash(hash)
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
  }
}
