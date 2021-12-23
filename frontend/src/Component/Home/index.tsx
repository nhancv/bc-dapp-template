import * as React from 'react';
import { Alert, Button, Col, Container, Input, Row } from 'reactstrap';
import CryptoLottContract, { Player } from '../../Contract/CryptoLottContract';
import Web3 from 'web3';
import Circle from 'react-circle';
import './style.css';
import { Rules } from '../index';
import fromExponential from 'from-exponential';
// import { BigNumber } from "bignumber.js";

// const { prettyNum, ROUNDING_MODE } = require("pretty-num");
const ethers = require('ethers');

type MainProps = {};
type MainState = {
  account: string | undefined;
  networkId: string | undefined;
  providerValid: boolean;
  initializing: boolean;
  currentBalance: number;
  contractAddress: string;
  minPrice: number;
  countPlayer: number;
  maxPlayer: number;
  maxLuckyRandomNumber: number;
  lastTotalFund: number;
  lastLuckyNumber: number;
  currentFund: number;
  ownerAddress: string;
  charityAddress: string;
  charityBalance: number;
  playerInfo: Player;
  msgLog: string;
  inputPlayerName: string;
  inputPlayerNumbers: string;
  inputOwner: string;
};

const NETWORK_INFO = {
  '1': {
    name: 'ETH(mainnet)',
    symbol: 'ETH',
    contract: '0xb898CEaE9B41fF87b2bC22a41E63755604fE4771',
    scanUrl: 'https://etherscan.io',
  },
  '3': {
    name: 'ETH(Ropsten)',
    symbol: 'ETH',
    contract: undefined,
    scanUrl: 'https://ropsten.etherscan.io',
  },
  '56': {
    name: 'BSC(mainnet)',
    symbol: 'BNB',
    contract: undefined,
    scanUrl: 'https://bscscan.com',
  },
  '97': {
    name: 'BSC(testnet)',
    symbol: 'BNB',
    contract: undefined,
    scanUrl: 'https://testnet.bscscan.com',
  },
};

class Main extends React.Component<MainProps, MainState> {
  // Set default props
  static defaultProps = {};
  web3: Web3 | undefined;
  contract: CryptoLottContract | undefined;

  constructor(props: MainProps) {
    super(props);
    this.state = {
      networkId: undefined,
      account: undefined,
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
        playerNumbers: [],
      },
      msgLog: '',
      inputPlayerName: '',
      inputPlayerNumbers: '',
      inputOwner: '',
    };
  }

  isETH = (): boolean => {
    return ['1', '3', '4'].includes(this.state.networkId ?? '0');
  };

  isBSC = (): boolean => {
    return ['56', '97'].includes(this.state.networkId ?? '0');
  };

  isNetworkSupported = (): boolean => {
    return this.isETH() || this.isBSC();
  };

  isTestnet = (): boolean => {
    return ['3', '4', '97', '80001', '4002', '256'].includes(this.state.networkId ?? '0');
  };

  getFeeSymbol = () => {
    return this.networkInfo()?.symbol ?? 'n/a';
  };

  initWeb3 = async (doneCb: any) => {
    const localHttpProvider: boolean = false;
    setTimeout(() => {
      if (!this.web3 || !this.contractIsReady()) {
        this.setState({ initializing: false });
      }
    }, 1000);

    if (localHttpProvider) {
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      this.web3 = new Web3(provider);
      // console.log('Use Web3 provider at: http://127.0.0.1:7545')
    } else {
      // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
      if (typeof window !== 'undefined') {
        // Modern dapp browsers...
        if (window['ethereum']) {
          window['web3'] = new Web3(window['ethereum']);
          // Request account access if needed
          await window['ethereum'].enable();

          window['ethereum'].on('accountsChanged', (accounts: any) => {
            if (this.web3) {
              this.web3.eth.defaultAccount = accounts[0];
            }
            this.setState(
              {
                account: accounts[0],
              },
              () => {
                this.initializeContract(false);
              },
            );
          });

          window['ethereum'].on('networkChanged', (networkId: string) => {
            this.setState(
              {
                networkId,
              },
              () => {
                this.initializeContract(true);
              },
            );
          });
        } else if (window['web3']) {
          // Legacy dapp browsers...
          window['web3'] = new Web3(window['web3'].currentProvider);
        } else {
          // Non-dapp browsers...
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }

        if (window['web3']) {
          this.web3 = new Web3(window['web3'].currentProvider);
        }
      }
    }

    if (this.web3) {
      this.setState({ providerValid: true });
      try {
        await this.web3.eth.getChainId().then((networkId: number) => {
          this.setState({
            networkId: networkId.toString(),
          });
        });
        await this.web3.eth.getAccounts((error, accounts) => {
          if (!error && accounts.length !== 0 && this.web3) {
            this.web3.eth.defaultAccount = accounts[0];
            this.setState(
              {
                account: accounts[0],
              },
              () => {
                doneCb();
              },
            );
          } else {
            console.error(error);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  getContractAddress = async () => {
    if (this.contract?.contractAddress) {
      this.setState({
        contractAddress: this.contract.contractAddress,
      });
    }
  };

  getCurrentBalance = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.viewBalance().then((balance) => {
      this.setState({
        currentBalance: Number(balance),
      });
    });
  };

  getMinPrice = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getMinPrice().then((num) => {
      this.setState({
        minPrice: num,
      });
    });
  };

  getCountPlayer = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getCountPlayer().then((num) => {
      this.setState({
        countPlayer: num,
      });
    });
  };

  getMaxPlayer = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getMaxPlayer().then((num) => {
      this.setState({
        maxPlayer: num,
      });
    });
  };

  getMaxLuckyRandomNumber = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getMaxLuckyRandomNumber().then((num) => {
      this.setState({
        maxLuckyRandomNumber: num,
      });
    });
  };

  getLastTotalFund = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getLastTotalFund().then((num) => {
      this.setState({
        lastTotalFund: num,
      });
    });
  };

  getLastLuckyNumber = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getLastLuckyNumber().then((num) => {
      this.setState({
        lastLuckyNumber: num,
      });
    });
  };

  getCurrentFund = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getCurrentFund().then((num) => {
      this.setState({
        currentFund: num,
      });
    });
  };

  getCharityAddress = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getCharityAddress().then((data) => {
      this.setState({
        charityAddress: data,
      });

      this.contract?.viewBalance(data).then((balance) => {
        this.setState({
          charityBalance: Number(balance),
        });
      });
    });
  };

  getOwnerAddress = () => {
    if (!this.contractIsReady()) return;
    return this.contract?.getOwnerAddress().then((data) => {
      this.setState({
        ownerAddress: data,
      });
    });
  };

  getPlayerInfo = (playerAddress: string) => {
    if (!this.contractIsReady()) return;
    return this.contract?.getPlayerInfo(playerAddress).then((data) => {
      this.setState({
        playerInfo: {
          playerName: data.playerName,
          playerAddress,
          playerNumbers: data.playerNumbers,
        },
      });
    });
  };

  /**
   * this.debounce(async () => {
   *    /// ... extra logic here
   * })();
   * @param func
   * @param timeout
   */
  debounce = (func: any, timeout = 500) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  // 1e18 => 1
  formatUnits = (amount: any, decimals = 18) => {
    return ethers.utils.formatUnits(fromExponential(amount || 0), decimals);
  };

  // 1 => 1000000000000000000
  parseUnits = (amount: any, decimals = 18) => {
    return ethers.utils.parseUnits(fromExponential(amount || 0), decimals);
  };

  verifyNumbersInput = (numbers: string): number[] => {
    try {
      if (!numbers) {
        return [];
      }
      const intNumbers: number[] = numbers
        .split(/[ ,-]+/g)
        .map((s) => parseInt(s, 10))
        .filter((n) => !isNaN(n) && n <= this.state.maxLuckyRandomNumber);

      if (intNumbers.length === 0) {
        return [];
      }
      return intNumbers;
    } catch (e) {
      return [];
    }
  };

  playerRegister = (name: string, numbersStr: string) => {
    const numbers: number[] = this.verifyNumbersInput(numbersStr);
    if (numbers.length === 0) {
      console.error('Number is empty');
      return;
    }

    if (!this.contractIsReady()) return;
    if (this.state.minPrice === 0) return;

    this.setState({
      msgLog: '',
    });

    const value = numbers.length * this.state.minPrice;
    this.contract
      ?.playerRegister(name, numbers, value, (transactionHash: any) => {
        this.setState({
          msgLog: `Request Transaction Hash:
        <a href="${
          this.networkInfo()?.scanUrl
        }/tx/${transactionHash}" target="_blank" rel="noreferrer" className="alert-link">
        ${transactionHash}</a>`,
        });
      })
      .then(
        (hashObject: {
          transactionHash: any;
          blockNumber: any;
          cumulativeGasUsed: any;
          gasUsed: any;
          from: any;
          to: any;
        }) => {
          this.setState({
            msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `,
          });
          this.refreshAllData();
        },
        (error: any) => {
          this.setState({
            msgLog: 'Error',
          });
        },
      );
  };

  ownerUpCharityAddress = (charityAddress: string) => {
    if (!this.contractIsReady()) return;
    return this.contract
      ?.ownerUpCharityAddress(charityAddress, (transactionHash: any) => {
        this.setState({
          msgLog: `Request Transaction Hash:
        <a href="${this.networkInfo()?.scanUrl}/tx/${transactionHash}" target="_blank" className="alert-link">
        ${transactionHash}</a>`,
        });
      })
      .then(
        (hashObject) => {
          this.setState({
            msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `,
          });
          this.refreshAllData();
        },
        (error) => {
          this.setState({
            msgLog: 'Error',
          });
        },
      );
  };

  ownerEnableContract = (ownerInput: string) => {
    if (!this.contractIsReady()) return;
    const status = ownerInput !== 'false';
    return this.contract
      ?.ownerEnableContract(status, (transactionHash: any) => {
        this.setState({
          msgLog: `Request Transaction Hash:
        <a href="${this.networkInfo()?.scanUrl}/tx/${transactionHash}" target="_blank" className="alert-link">
        ${transactionHash}</a>`,
        });
      })
      .then(
        (hashObject) => {
          this.setState({
            msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `,
          });
          this.refreshAllData();
        },
        (error) => {
          this.setState({
            msgLog: 'Error',
          });
        },
      );
  };

  ownerConfig = (ownerInput: string) => {
    let minPrice: number;
    let maxPlayerRandom: number;
    let maxLuckyNumberRandom: number;
    let charityRate: number;
    let winnerRate: number;

    if (!this.contractIsReady()) return;
    const arrs: number[] = ownerInput
      .split(/[ ,-]+/g)
      .map((s) => Number(s))
      .filter((n) => !isNaN(n));
    if (arrs.length !== 5) return;
    minPrice = arrs[0];
    maxPlayerRandom = arrs[1];
    maxLuckyNumberRandom = arrs[2];
    charityRate = arrs[3];
    winnerRate = arrs[4];
    return this.contract
      ?.ownerConfig(
        minPrice,
        maxPlayerRandom,
        maxLuckyNumberRandom,
        charityRate,
        winnerRate,
        (transactionHash: any) => {
          this.setState({
            msgLog: `Request Transaction Hash:
        <a href="${
          this.networkInfo()?.scanUrl
        }/tx/${transactionHash}" target="_blank" rel="noreferrer" className="alert-link">
        ${transactionHash}</a>`,
          });
        },
      )
      .then(
        (hashObject) => {
          this.setState({
            msgLog: `
        Transaction Hash: ${hashObject.transactionHash}<br/>
        Block Hash: ${hashObject.blockNumber}<br/>
        Cumulative Gas Used: ${hashObject.cumulativeGasUsed}<br/>
        Gas Used: ${hashObject.gasUsed}<br/>
        From: ${hashObject.from}<br/>
        To: ${hashObject.to}<br/>
        `,
          });
          this.refreshAllData();
        },
        (error) => {
          this.setState({
            msgLog: 'Error',
          });
        },
      );
  };

  refreshAllData = (isNetworkChange = false) => {
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
      this.getPlayerInfo(this.state.account ?? ''),
    ]).then(() => {
      if (this.state.initializing) {
        this.setState({ initializing: false });
      }
    });
  };

  networkInfo = () => {
    return NETWORK_INFO[this.state.networkId ?? ''];
  };

  web3IsReady = (): boolean => {
    return this.state && this.state.providerValid;
  };

  contractIsReady = (): boolean => {
    return !!(this.web3IsReady() && this.isNetworkSupported() && this.contract);
  };

  updateInputPlayerName = (evt: { target: { value: any } }) => {
    this.setState({
      inputPlayerName: evt.target.value,
    });
  };

  updateInputPlayerNumbers = (evt: { target: { value: any } }) => {
    this.setState({
      inputPlayerNumbers: evt.target.value,
    });
  };

  updateInputOwner = (evt: { target: { value: any } }) => {
    this.setState({
      inputOwner: evt.target.value,
    });
  };

  isPlayerNew = (): boolean => {
    return !(this.state.playerInfo && this.state.playerInfo.playerNumbers.length > 0);
  };

  normalizeEthBalance = (input: number): string => {
    if (this.web3?.utils && input >= 0) {
      return this.web3.utils.fromWei(input.toString(), 'ether') + ' ETH';
    }
    return 'n/a';
  };

  initializeContract = (isNetworkChange = false) => {
    const contractAddress = this.networkInfo()?.contract;
    if (contractAddress) {
      this.contract = new CryptoLottContract(this.web3, this.state.account, contractAddress);
      this.refreshAllData(isNetworkChange);
      this.contract.trackingEvent(() => {
        this.refreshAllData(false);
      });
    }
  };

  componentWillMount() {
    if (!this.web3)
      this.initWeb3(() => {
        this.initializeContract(true);
      }).then();
  }

  render() {
    if (this.web3IsReady()) {
      if (this.contractIsReady()) {
        return (
          <Container>
            {/*Msg log after register*/}
            {this.state.msgLog ? (
              <Row style={{ marginTop: '1rem' }}>
                <Col>
                  <Alert color="info" isOpen={!!this.state.msgLog}>
                    <div dangerouslySetInnerHTML={{ __html: this.state.msgLog }} />
                  </Alert>
                </Col>
              </Row>
            ) : null}

            {/*Wallet information*/}
            <Row style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Col>
                <Circle
                  progress={
                    this.state.maxPlayer > 0 ? Math.floor((this.state.countPlayer / this.state.maxPlayer) * 100) : 0
                  }
                  size="200"
                  progressColor={'#206A25'}
                  lineWidth={'2'}
                  textColor={'white'}
                />
              </Col>
            </Row>

            {/*Game information*/}
            <Row style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Col>
                <h6>
                  Price is&nbsp;
                  <span style={{ fontSize: '1.7rem' }}>{this.normalizeEthBalance(this.state.minPrice)}/number</span>
                </h6>
                <h6>
                  Maximum lucky value is&nbsp;
                  <span style={{ fontSize: '2rem' }}>{this.state.maxLuckyRandomNumber}</span>
                </h6>
                <h6>
                  <span style={{ fontSize: '1.7rem' }}>
                    {this.state.countPlayer} / {this.state.maxPlayer}
                  </span>{' '}
                  player joined
                </h6>
                <h6>
                  Fund till now is&nbsp;
                  <span style={{ fontSize: '2rem' }}>{this.normalizeEthBalance(this.state.currentFund)}</span>
                </h6>
                {this.state.currentFund < this.state.minPrice * this.state.maxPlayer ? (
                  <h6>
                    The fund can up to&nbsp;
                    <span style={{ fontSize: '2.5rem' }}>
                      {this.normalizeEthBalance(
                        this.state.currentFund -
                          this.state.countPlayer * this.state.minPrice +
                          this.state.minPrice * this.state.maxPlayer,
                      )}
                    </span>
                    &nbsp; as minimum
                  </h6>
                ) : null}

                {this.state.lastLuckyNumber > 0 ? (
                  <h6>
                    Last lucky number is&nbsp;
                    <span style={{ fontSize: '2rem' }}>{this.state.lastLuckyNumber}</span>
                    {this.state.lastTotalFund > 0 ? (
                      <div>
                        &nbsp;with&nbsp;
                        <span style={{ fontSize: '1.7rem' }}>{this.normalizeEthBalance(this.state.lastTotalFund)}</span>
                      </div>
                    ) : null}
                  </h6>
                ) : null}
              </Col>
            </Row>

            <div className={'break-line'} />

            {/*Player info*/}
            {this.isPlayerNew() ? (
              <Row style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Col>
                  <h4>Hi Guest,</h4>
                  <h6>You have {this.normalizeEthBalance(this.state.currentBalance)}</h6>
                  <h6>
                    Your address is &nbsp;
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${this.networkInfo()?.scanUrl}/address/${this.state.playerInfo.playerAddress}`}
                    >
                      {this.state.playerInfo.playerAddress}
                    </a>
                  </h6>
                  <h6>Fill the form below to register</h6>
                  <div className={'Player-input'}>
                    <Input
                      type="text"
                      value={this.state.inputPlayerName}
                      onChange={(evt) => this.updateInputPlayerName(evt)}
                      placeholder="Player Name"
                    />
                  </div>
                  <div className={'Player-input'}>
                    <Input
                      type={'text'}
                      value={this.state.inputPlayerNumbers}
                      onChange={(evt) => this.updateInputPlayerNumbers(evt)}
                      placeholder="Player Lucky Numbers: 1, 2, 3"
                    />
                  </div>
                  <div className={'Player-input'}>
                    <Button
                      disabled={
                        !this.state.inputPlayerName ||
                        this.verifyNumbersInput(this.state.inputPlayerNumbers).length === 0
                      }
                      color="primary"
                      onClick={() => {
                        this.playerRegister(this.state.inputPlayerName, this.state.inputPlayerNumbers);
                        this.setState({
                          inputPlayerName: '',
                          inputPlayerNumbers: '',
                        });
                      }}
                    >
                      Register
                    </Button>
                  </div>
                </Col>
              </Row>
            ) : this.state.playerInfo ? (
              <Row style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Col>
                  <h5>
                    Hi&nbsp;
                    <span style={{ fontSize: '2rem' }}>{this.state.playerInfo.playerName}</span>, you are already done
                    this round.
                  </h5>

                  <h6>
                    Registered address: &nbsp;
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${this.networkInfo()?.scanUrl}/address/${this.state.playerInfo.playerAddress}`}
                    >
                      {this.state.playerInfo.playerAddress}
                    </a>
                  </h6>
                  <h6>
                    Registered numbers: &nbsp;
                    <span style={{ fontSize: '2rem' }}>{this.state.playerInfo.playerNumbers.toString()}</span>
                  </h6>

                  <h4>
                    Wait for the result and &nbsp;
                    <span style={{ fontSize: '2rem' }}>Good luck!!!</span>
                  </h4>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <h6>Player info is empty</h6>
                </Col>
              </Row>
            )}

            <div className={'break-line'} />

            {/*  More information */}
            <Row style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Col>
                {/*Contract address*/}
                <h4>More information</h4>
                <h6>
                  Contract address is &nbsp;
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${this.networkInfo()?.scanUrl}/address/${this.state.contractAddress}`}
                  >
                    {this.state.contractAddress}
                  </a>
                </h6>
                {/*Charity address*/}
                <h6>
                  Charity address is &nbsp;
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${this.networkInfo()?.scanUrl}/address/${this.state.charityAddress}`}
                  >
                    {this.state.charityAddress}
                  </a>
                </h6>
              </Col>
            </Row>

            {/*  Admin*/}

            {this.state.account === this.state.ownerAddress ? (
              <Row style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Col>
                  <div className={'break-line'} />

                  <h4 style={{ marginTop: '1rem' }}>Owner panel</h4>

                  <div className={'Player-input'}>
                    <Input
                      type={'text'}
                      value={this.state.inputOwner}
                      onChange={(evt) => this.updateInputOwner(evt)}
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
                    <h6>Params: minPrice, maxPlayerRandom, maxLuckyNumberRandom, charityRate, winnerRate</h6>
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
            ) : null}
          </Container>
        );
      } else {
        return (
          <div>
            <Row className="App-invalidProvider">
              <Col>{this.state.initializing ? null : <h6>Network not yet supported.</h6>}</Col>
            </Row>
          </div>
        );
      }
    } else {
      return (
        <div>
          <Row className="App-invalidProvider">
            <Col>
              {this.state.initializing ? null : (
                <h6>
                  Non-Ethereum browser detected. You should consider trying&nbsp;
                  <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                    MetaMask!
                  </a>
                </h6>
              )}
            </Col>
          </Row>
          <Rules />
        </div>
      );
    }
  }
}

export default Main;
