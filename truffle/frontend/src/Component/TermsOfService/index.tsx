import * as React from 'react'
import {Col, Container, Row} from 'reactstrap'
import './style.css'

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
            <h2>Terms of service</h2>
            <p>
              The web site of `Crypto Lottery` ("we") provides interface to the Smart Contract on the Ethereum
              blockchain, which accepts ETH tokens and transfers varying amounts of ETH tokens in return, depending on
              external factors.
              <br/>
              We are not able to verify the legality of the service in each jurisdiction and provide you with any legal
              advice. It is your sole responsibility to comply with any relevant laws, policies and regulations of your
              jurisdiction regarding the use of ETH tokens in the way described above.
              <br/>
              Playing the games offered by the Smart Contract can lead to obtainment or loss of ETH tokens. We do not
              hold any responsibility for the results of the games we provide.
              <br/>
              We reserve the right to modify the website and its services and these terms without any prior notice. We
              advise to check for updates on regular basis.
            </p>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Main
