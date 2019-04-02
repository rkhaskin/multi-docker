import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';
import temp from './temp';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Link to="/temp">Temp</Link>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>
        
        <div>
          <Route exact path="/temp" component={temp} />
          <Route exact path="/" component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </div>
      </Router>
    );
  }
}

export default App;
