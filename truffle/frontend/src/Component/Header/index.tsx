import * as React from 'react'
import {Link} from 'react-router-dom';
import './style.css'

const logo = require('./logo.png')

type MainProps = {}
type MainState = {}

class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <Link to={'/'} className="nav-link">
            <img src={logo} className="App-logo" alt="Crypto Lottery logo"/>
          </Link>
          <h1 className="App-title">Crypto Lottery</h1>
        </header>
        <div style={{marginTop: '1rem', backgroundColor: '#393939', height: '1px'}}/>
      </div>
    )
  }
}

export default Main
