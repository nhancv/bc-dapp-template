import * as React from 'react'
import {DApps, Footer, Header, HomeView, Rules, TermsOfService} from './Component'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css'

type AppProps = {}
type AppState = {}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route exact={true} path="/" component={HomeView}/>
            <Route exact={true} path="/rules" component={Rules}/>
            <Route exact={true} path="/terms-of-service" component={TermsOfService}/>
            <Route exact={true} path="/dapps" component={DApps}/>
            <Route component={Rules}/>
          </Switch>
          <Footer/>
        </div>
      </Router>
    )
  }
}

export default App
