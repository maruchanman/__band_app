import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './components/App.js';

export default class gigs extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('gigs', () => gigs);
