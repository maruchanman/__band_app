import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import Home from './components/Home.js';
import Ntwk from './components/Ntwk.js';
import LiveList from './components/LiveList.js';
import Live from './components/Live.js';
import Band from './components/Band.js';

export default class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/ntwk" component={Ntwk}/>
        <Route path="/live" component={LiveList}/>
        <Route path="/live/:liveID" component={Live}/>
        <Route path="/band/:bandID" component={Band}/>
      </Router>
    );
  }
}
