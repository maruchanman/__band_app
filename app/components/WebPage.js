import React from 'react';
import {
  View,
  WebView,
} from 'react-native';

export default class WebPage extends React.Component {

  render() {

    return (
      <View style={{paddingTop: 70, flex: 1}}>
        <WebView source={{uri: this.props.url}} />
      </View>
    )

  }

}
