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
            <h2>DApps</h2>
            <h6>
              <a href="https://dapp.review/dapp/11730" target="_blank" className="alert-link">
                https://dapp.review/dapp/11730
              </a>
            </h6>
            <h6>
              <a href="https://www.stateofthedapps.com/dapps/crypto-lottery" target="_blank" className="alert-link">
                https://www.stateofthedapps.com/dapps/crypto-lottery
              </a>
            </h6>
            <h6>
              <a href="https://www.dapp.com/dapp/crypto-lottery" target="_blank" className="alert-link">
                https://www.dapp.com/dapp/crypto-lottery
              </a>
            </h6>
            <h6>
              <a href="https://dappradar.com/app/1577/crypto-lottery" target="_blank" className="alert-link">
                https://dappradar.com/app/1577/crypto-lottery
              </a>
            </h6>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Main
