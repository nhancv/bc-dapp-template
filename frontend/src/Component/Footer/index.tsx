import * as React from 'react'
import { Link } from 'react-router-dom';
import './style.css'

type MainProps = {}
type MainState = {}

class Main extends React.Component<MainProps, MainState> {
  // constructor(props: MainProps) {
  //   super(props)
  // }

  render() {
    return (
      <div>
        <div style={{marginTop: '1rem', backgroundColor: '#393939', height: '1px'}}/>
        <footer className="App-footer">
          <Link to={'/'} className="nav-link">Home</Link>
          <Link to={'/rules'} className="nav-link">Rules</Link>
          <Link to={'/terms-of-service'} className="nav-link">Terms Of Service</Link>
          <Link to={'/dapps'} className="nav-link">DApps</Link>
          <div>
            <br/>
            <h6>© 2019 cryptolott.io@gmail.com</h6>
          </div>
        </footer>
      </div>
    )
  }
}

export default Main
