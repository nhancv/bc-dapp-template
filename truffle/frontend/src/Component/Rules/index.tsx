import * as React from 'react'
import { Col, Container, Row } from 'reactstrap'
import './style.css'

const clipHowToBuy = require('./crypto_lottery_clip_how_to_buy.mp4')
const clipInstruction = require('./crypto_lottery_clip_instruction.mp4')
const cryptoLotteryDistribution = require('./crypto_lottery_distribution.jpg')

type MainProps = {}
type MainState = {}

class Main extends React.Component<MainProps, MainState> {
  // Set default props
  static defaultProps = {}

  constructor(props: MainProps) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Container className="App-container-fix-height">
        <br/>
        <Row>
          <Col>
            <h1>Crypto Lottery</h1>
            <h6>
              Crypto Lottery allows players to purchase some hopeful numbers. The system will random one lucky number
              and the fund will be distributed to every player who keeps the number same as the system.
            </h6>
            <br/>

            <h2>What excited game is?</h2>
            <h6>
              This game with rules definitely demonstrates a future of lottery.
            </h6>
            <ul>
              <li>Crypto Lottery runs on Blockchain technology via Smart contract especially Ethereum keep innovative
                values: Transparent, Immutable, Distributed, Secure.
              </li>
              <li>Crypto Lottery is a fair game for everyone.</li>
              <li>Crypto Lottery contract was verified and published on the main net. Everyone can check and test it
                absolutely.
              </li>
              <li>Crypto Lottery contract was designed with a simple approach and structure to obey the rules, it can not
                be destroyed or change or upgrade the initial rules.
              </li>
              <li>Crypto Lottery game properties are dynamic and auto scale by session game time and no one can touch
                and guess it.
              </li>
              <li>Crypto Lottery random algorithm is smart and complex depend on a lot of incredible params. It's
                impossible to fake it even contract author.
              </li>
              <li>Crypto Lottery author creates rules and see what further happen and cannot touch on rules anymore.
              </li>
              <li>Crypto Lottery raises funds for charity. Play the game and make a bit of charity for life. If the
                charity fund is big enough, we use and public the activities for sure.
              </li>
              <li>Happy Crypto Lottery!!!</li>
            </ul>
            <br/>

            <h3>Game Rules</h3>
            <h5>
              Crypto Lottery works like a game</h5>
            <ul>
              <li>The number player each round is random. The initial range is [5-7] and it will be adjusted
                automatically.
              </li>
              <li>The lucky number is random by system. The initial range is [0-255] and it will be adjusted
                automatically.
              </li>
              <li>One player joins the game by providing the name and some hopeful numbers. One player can register
                multi
                numbers, but only one time in one round.
              </li>
              <li>The system will distribute 60% total to every winning player who keeps the number is exact with the
                lucky number.
              </li>
              <li>The fund will retain 50% to accumulate to the next round if no winner in the current round. 10%
                remaining will be divided for charity fund and developer.
              </li>
            </ul>
            <br/>

            <h5>Crypto Lottery Distribution</h5>
            <ul>
              <li>60% for winners</li>
              <li>15% for charity fund (separate address)</li>
              <li>10% for system maintenance</li>
              <li>10% for marketing</li>
              <li>5% for developers</li>
            </ul>

            <img src={cryptoLotteryDistribution} className="img-fluid" alt="Crypto Lottery Distribution"/>

            <br/>
            <br/>

            <h5>Crypto Lottery Instruction</h5>
            <video className={'video-border'} width="100%" height="auto" controls={true}>
              <source src={clipInstruction} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
            <br/>
            <br/>

            <h5>Crypto Lottery How To Buy</h5>
            <video className={'video-border'} width="100%" height="auto" controls={true}>
              <source src={clipHowToBuy} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
            <br/>

            <h5>Crypto Lottery Contact</h5>
            <h6>
              cryptolott.io@gmail.com
            </h6>
            <br/>

          </Col>
        </Row>
      </Container>
    )
  }
}

export default Main
