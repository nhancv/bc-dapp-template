import * as React from 'react'
import { Alert, Button, Col, Container, Input, Row } from 'reactstrap'
import CryptoLottContract, { Player } from '../../Contract/CryptoLottContract';
import Web3 from 'web3';
import Circle from 'react-circle';
import './style.css'
import { Rules } from '../index';

type MainProps = {}
type MainState = {
  providerValid: boolean
  initializing: boolean
  currentBalance: number
  contractAddress: string
  minPrice: number
  countPlayer: number
  maxPlayer: number
  maxLuckyRandomNumber: number
  lastTotalFund: number
  lastLuckyNumber: number
  currentFund: number
  ownerAddress: string
  charityAddress: string
  charityBalance: number
  playerInfo: Player
  msgLog: string
  inputPlayerName: string
  inputPlayerNumbers: string
  inputOwner: string
}

class Main extends React.Component<MainProps, MainState> {
  // Set default props
  static defaultProps = {};
  web3: Web3;
  account: string;
  contract: CryptoLottContract;
  textInput: Input;

  constructor(props: MainProps) {
    super(props);
    this.state = {
      providerValid: false,
      initializing: true,
      currentBalance: 0,
      contractAddress: '',
      minPrice: 0,
      countPlayer: 0,
      maxPlayer: 0,
      maxLuckyRandomNumber: 0,
      lastTotalFund: 0,
      lastLuckyNumber: 0,
      currentFund: 0,
      ownerAddress: '',
      charityAddress: '',
      charityBalance: 0,
      playerInfo: {
        playerAddress: '',
        playerName: '',
        playerNumbers: []
      },
      msgLog: '',
      inputPlayerName: '',
      inputPlayerNumbers: '',
      inputOwner: ''
    }
  }

  componentWillMount() {
    if (!this.web3) this.initWeb3(() => {
      this.contract = new CryptoLottContract(this.web3, this.account)
      this.setState({providerValid: true})
      this.refreshAllData()
      this.contract.trackingEvent(() => {
        this.refreshAllData();
      })
    })
  }

  initWeb3 = async (doneCb: any) => {
    const localHttpProvider: boolean = false;
    setTimeout(() => {
      if (!this.web3 || !this.constractReady()) {
        this.setState({initializing: false});
      }
    }, 1000);

    if (localHttpProvider) {
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
      this.web3 = new Web3(provider)
      console.log('Use Web3 provider at: http://127.0.0.1:7545')
    } else {
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
      if (typeof window !== 'undefined') {
        // Modern dapp browsers...
        if (window['ethereum']) {
          window['web3'] = new Web3(window['ethereum'])
          // Request account access if needed
          await window['ethereum'].enable()
        } else if (window['web3']) {
          // Legacy dapp browsers...
          window['web3'] = new Web3(window['web3'].currentProvider)
        } else {
          // Non-dapp browsers...
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }

        if (window['web3']) {
          this.web3 = new Web3(window['web3'].currentProvider)
        }
      }
    }

    if (this.web3) {
      try {
        this.web3.eth.getAccounts((error, accounts) => {
          if (!error && accounts.length !== 0) {
            this.account = accounts[0]
            this.web3.eth.defaultAccount = this.account
            doneCb()
          } else {
            console.error(error)
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  getContractAddress = () => {
    this.setState({
      contractAddress: this.contract.contractAddress
    })
  }

  getCurrentBalance = () => {
    if (!this.constractReady()) return
    this.contract.viewBalance().then(balance => {
      this.setState({
        currentBalance: balance
      })
    })
  }

  getMinPrice = () => {
    if (!this.constractReady()) return
    return this.contract.getMinPrice().then(num => {
      this.setState({
        minPrice: num
      })
    });
  }

  getCountPlayer = () => {
    if (!this.constractReady()) return
    return this.contract.getCountPlayer().then(num => {
      this.setState({
        countPlayer: num
      })
    });
  }

  getMaxPlayer = () => {
    if (!this.constractReady()) return
    return this.contract.getMaxPlayer().then(num => {
      this.setState({
        maxPlayer: num
      })
    });
  }

  getMaxLuckyRandomNumber = () => {
    if (!this.constractReady()) return
    return this.contract.getMaxLuckyRandomNumber().then(num => {
      this.setState({
        maxLuckyRandomNumber: num
      })
    });
  }

  getLastTotalFund = () => {
    if (!this.constractReady()) return
    return this.contract.getLastTotalFund().then(num => {
      this.setState({
        lastTotalFund: num
      })
    });
  }

  getLastLuckyNumber = () => {
    if (!this.constractReady()) return
    return this.contract.getLastLuckyNumber().then(num => {
      this.setState({
        lastLuckyNumber: num
      })
    });
  }

  getCurrentFund = () => {
    if (!this.constractReady()) return
    return this.contract.getCurrentFund().then(num => {
      this.setState({
        currentFund: num
      })
    });
  }

  getCharityAddress = () => {
    if (!this.constractReady()) return
    return this.contract.getCharityAddress().then(data => {
      this.setState({
        charityAddress: data
      })

      this.contract.viewBalance(data).then(balance => {
        this.setState({
          charityBalance: balance
        })
      });
    });
  }

  getOwnerAddress = () => {
    if (!this.constractReady()) return
    return this.contract.getOwnerAddress().then(data => {
      this.setState({
        ownerAddress: data
      })
    });
  }

  getPlayerInfo = (playerAddress: string) => {
    if (!this.constractReady()) return
    return this.contract.getPlayerInfo(playerAddress).then(data => {
      this.setState({
        playerInfo: {
          playerName: data.playerName,
          playerAddress: playerAddress,
          playerNumbers: data.playerNumbers
        }
      })
    });
  }

  verifyNumbersInput = (numbers: string): number[] => {
    try {
      if (!numbers) {
        return [];
      }
      let intNumbers: number[] = numbers.split(/[\ \,\-]+/g)
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n) && n <= this.state.maxLuckyRandomNumber);

      if (intNumbers.length === 0) {
        return [];
      }
      return intNumbers;
    } catch (e) {
      return [];
    }
  }

  playerRegister = (name: string, numbersStr: string) => {
    let numbers: number[] = this.verifyNumbersInput(numbersStr);
    if (numbers.length === 0) {
      console.error('Number is empty');
      return;
    }

    if (!this.constractReady()) return;
    if (this.state.minPrice === 0) return;

    this.setState({
      msgLog: ''
    });

    let value = numbers.length * this.state.minPrice;
    this.contract
      .playerRegister(name, numbers, value, transactionHash => {
        this.setState({
          msgLog: `Request Transaction Hash: 
        <a href="https://etherscan.io/tx/${transactionHash}" target="_blank" className="alert-link">
        ${transactionHash}</a>`
        })
      })
      .then(
        hashObject => {
          this.setState({
            msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `
          })
          this.refreshAllData();
        },
        error => {
          this.setState({
            msgLog: 'Error'
          })
        }
      )
  }

  ownerUpCharityAddress = (charityAddress: string) => {
    if (!this.constractReady()) return
    return this.contract.ownerUpCharityAddress(charityAddress, transactionHash => {
        this.setState({
          msgLog: `Request Transaction Hash: 
        <a href="https://etherscan.io/tx/${transactionHash}" target="_blank" className="alert-link">
        ${transactionHash}</a>`
        })
      }
    ).then(hashObject => {
        this.setState({
          msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `
        });
        this.refreshAllData();
      },
      error => {
        this.setState({
          msgLog: 'Error'
        })
      });
  }

  ownerEnableContract = (ownerInput: string) => {
    if (!this.constractReady()) return;
    let status = ownerInput !== 'false';
    return this.contract.ownerEnableContract(status, transactionHash => {
        this.setState({
          msgLog: `Request Transaction Hash: 
        <a href="https://etherscan.io/tx/${transactionHash}" target="_blank" className="alert-link">
        ${transactionHash}</a>`
        })
      }
    ).then(hashObject => {
        this.setState({
          msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `
        })
        this.refreshAllData();
      },
      error => {
        this.setState({
          msgLog: 'Error'
        })
      });
  }

  ownerConfig = (ownerInput: string) => {
    let minPrice: number, maxPlayerRandom: number, maxLuckyNumberRandom: number,
      charityRate: number, winnerRate: number;

    if (!this.constractReady()) return;
    let arrs: number[] = ownerInput.split(/[\ \,\-]+/g)
      .map(s => Number(s))
      .filter(n => !isNaN(n));
    if (arrs.length !== 5) return;
    minPrice = arrs [0];
    maxPlayerRandom = arrs [1];
    maxLuckyNumberRandom = arrs [2];
    charityRate = arrs [3];
    winnerRate = arrs [4];
    return this.contract.ownerConfig(minPrice, maxPlayerRandom, maxLuckyNumberRandom,
      charityRate, winnerRate, transactionHash => {
        this.setState({
          msgLog: `Request Transaction Hash: 
        <a href="https://etherscan.io/tx/${transactionHash}" target="_blank" className="alert-link">
        ${transactionHash}</a>`
        })
      }
    ).then(hashObject => {
        this.setState({
          msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `
        })
        this.refreshAllData();
      },
      error => {
        this.setState({
          msgLog: 'Error'
        })
      });
  };

  refreshAllData = () => {
    Promise.all([
      this.getContractAddress(),
      this.getCurrentBalance(),
      this.getOwnerAddress(),
      this.getCharityAddress(),
      this.getMinPrice(),
      this.getCountPlayer(),
      this.getMaxPlayer(),
      this.getMaxLuckyRandomNumber(),
      this.getLastTotalFund(),
      this.getLastLuckyNumber(),
      this.getCurrentFund(),
      this.getPlayerInfo(this.account)
    ]).then(() => {
      if (this.state.initializing) {
        this.setState({initializing: false})
      }
    });
  }

  constractReady = (): boolean => {
    if (this.state && this.state.providerValid && this.contract) {
      return true
    }
    return false
  }

  updateInputPlayerName = evt => {
    this.setState({
      inputPlayerName: evt.target.value
    })
  }

  updateInputPlayerNumbers = evt => {
    this.setState({
      inputPlayerNumbers: evt.target.value
    })
  }

  updateInputOwner = evt => {
    this.setState({
      inputOwner: evt.target.value
    })
  }

  isPlayerNew = (): boolean => {
    return !(this.state.playerInfo && this.state.playerInfo.playerNumbers.length > 0)
  }

  normalizeEthBalance = (input: number): string => {
    if (this.web3.utils && input >= 0) {
      return this.web3.utils.fromWei(input.toString(), 'ether') + ' ETH';
    }
    return 'n/a'
  }

  render() {
    if (this.constractReady()) {
      return (
        <Container>
          {/*Msg log after register*/}
          {this.state.msgLog ?
            <Row style={{marginTop: '1rem'}}>
              <Col>
                <Alert color="info" isOpen={!!this.state.msgLog}>
                  <div dangerouslySetInnerHTML={{__html: this.state.msgLog}}/>
                </Alert>
              </Col>
            </Row> : null}

          {/*Game information*/}
          <Row style={{marginTop: '1rem', textAlign: 'center'}}>
            <Col>
              <Circle
                progress={this.state.maxPlayer > 0 ?
                  Math.floor((this.state.countPlayer / this.state.maxPlayer) * 100) : 0}
                size="200"
                progressColor={'#206A25'}
                lineWidth={'2'}
                textColor={'white'}
              />
            </Col>
          </Row>
          <Row style={{marginTop: '1rem', textAlign: 'center'}}>
            <Col>
              <h6>Price is&nbsp;
                <span style={{fontSize: '1.7rem'}}>{this.normalizeEthBalance(this.state.minPrice)}/number</span>
              </h6>
              <h6>Maximum lucky value is&nbsp;
                <span style={{fontSize: '2rem'}}>{this.state.maxLuckyRandomNumber}</span>
              </h6>
              <h6>
                <span style={{fontSize: '1.7rem'}}>{this.state.countPlayer} / {this.state.maxPlayer}</span> player
                joined
              </h6>
              <h6>Fund till now is&nbsp;
                <span style={{fontSize: '2rem'}}>{this.normalizeEthBalance(this.state.currentFund)}</span>
              </h6>
              {this.state.currentFund < (this.state.minPrice * this.state.maxPlayer) ?
                <h6>The fund can up to&nbsp;
                  <span
                    style={{fontSize: '2.5rem'}}>{this.normalizeEthBalance(this.state.currentFund - this.state.countPlayer * this.state.minPrice + this.state.minPrice * this.state.maxPlayer)}</span>&nbsp;
                  as minimum
                </h6> : null}

              {this.state.lastLuckyNumber > 0 ?
                <h6>Last lucky number is&nbsp;
                  <span style={{fontSize: '2rem'}}>{this.state.lastLuckyNumber}</span>

                  {this.state.lastTotalFund > 0 ?
                    <div>&nbsp;with&nbsp;
                      <span style={{fontSize: '1.7rem'}}>{this.normalizeEthBalance(this.state.lastTotalFund)}</span>
                    </div> : null}
                </h6> : null}
            </Col>
          </Row>

          <div className={'break-line'}/>

          {/*Player info*/}
          {this.isPlayerNew() ?
            <Row style={{marginTop: '1rem', textAlign: 'center'}}>
              <Col>
                <h4>Hi Guest,</h4>
                <h6>You have {this.normalizeEthBalance(this.state.currentBalance)}</h6>
                <h6>Your address is &nbsp;
                  <a target="_blank"
                     href={`https://etherscan.io/address/${this.state.playerInfo.playerAddress}`}>
                    {this.state.playerInfo.playerAddress}
                  </a>
                </h6>
                <h6>Fill the form below to register</h6>
                <div className={'Player-input'}>
                  <Input
                    type="text"
                    value={this.state.inputPlayerName}
                    onChange={evt => this.updateInputPlayerName(evt)}
                    placeholder="Player Name"
                  />
                </div>
                <div className={'Player-input'}>
                  <Input
                    type={'text'}
                    value={this.state.inputPlayerNumbers}
                    onChange={evt => this.updateInputPlayerNumbers(evt)}
                    placeholder="Player Lucky Numbers: 1, 2, 3"
                  />
                </div>
                <div className={'Player-input'}>
                  <Button
                    disabled={!this.state.inputPlayerName ||
                    this.verifyNumbersInput(this.state.inputPlayerNumbers).length === 0}
                    color="primary"
                    onClick={() => {
                      this.playerRegister(this.state.inputPlayerName, this.state.inputPlayerNumbers);
                      this.setState({
                        inputPlayerName: '',
                        inputPlayerNumbers: ''
                      });
                    }}
                  >
                    Register
                  </Button>
                </div>
              </Col>
            </Row> :
            this.state.playerInfo ?
              <Row style={{marginTop: '1rem', textAlign: 'center'}}>
                <Col>
                  <h5>Hi&nbsp;
                    <span style={{fontSize: '2rem'}}>{this.state.playerInfo.playerName}</span>
                    , you are already done this round.
                  </h5>

                  <h6>Registered address: &nbsp;
                    <a target="_blank"
                       href={`https://etherscan.io/address/${this.state.playerInfo.playerAddress}`}>
                      {this.state.playerInfo.playerAddress}
                    </a>
                  </h6>
                  <h6>Registered numbers: &nbsp;
                    <span style={{fontSize: '2rem'}}>{this.state.playerInfo.playerNumbers.toString()}</span>
                  </h6>

                  <h4>Wait for the result and &nbsp;
                    <span style={{fontSize: '2rem'}}>Good luck!!!</span>
                  </h4>
                </Col>
              </Row> : <Row><Col><h6>Player info is empty</h6></Col></Row>
          }

          <div className={'break-line'}/>

          {/*  More information */}
          <Row style={{marginTop: '1rem', textAlign: 'center'}}>
            <Col>
              {/*Contract address*/}
              <h4>More information</h4>
              <h6>
                Contract address is &nbsp;
                <a target="_blank" href={`https://etherscan.io/address/${this.state.contractAddress}`}>
                  {this.state.contractAddress}
                </a>
              </h6>
              {/*Charity address*/}
              <h6>
                Charity address is &nbsp;
                <a target="_blank" href={`https://etherscan.io/address/${this.state.charityAddress}`}>
                  {this.state.charityAddress}
                </a>
              </h6>
            </Col>
          </Row>

          {/*  Admin*/}

          {this.account === this.state.ownerAddress ?
            <Row style={{marginTop: '1rem', textAlign: 'center'}}>
              <Col>
                <div className={'break-line'}/>

                <h4 style={{marginTop: '1rem'}}>Owner panel</h4>

                <div className={'Player-input'}>
                  <Input
                    type={'text'}
                    value={this.state.inputOwner}
                    onChange={evt => this.updateInputOwner(evt)}
                    placeholder="Owner input"
                  />
                </div>

                <div className={'Player-input'}>
                  <h6>Params: address</h6>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.ownerUpCharityAddress(this.state.inputOwner);
                    }}
                  >
                    Update charity address
                  </Button>
                </div>
                <div className={'Player-input'}>
                  <h6>Params: boolean status true or false</h6>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.ownerEnableContract(this.state.inputOwner);
                    }}
                  >
                    Enable Contract
                  </Button>
                </div>
                <div className={'Player-input'}>
                  <h6>Params: minPrice, maxPlayerRandom, maxLuckyNumberRandom,
                    charityRate, winnerRate</h6>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.ownerConfig(this.state.inputOwner);
                    }}
                  >
                    Update config
                  </Button>
                </div>
              </Col>
            </Row>
            : null}
        </Container>
      )
    } else {
      return (
        <div>
          <Row className="App-invalidProvider">
            <Col>
              {this.state.initializing ? null :
                <h6>Non-Ethereum browser detected. You should consider trying&nbsp;
                  <a href="https://metamask.io/" target="_blank">MetaMask!</a>
                </h6>
              }
            </Col>
          </Row>
          <Rules/>
        </div>
      )
    }
  }
}

export default Main