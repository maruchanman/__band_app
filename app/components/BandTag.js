import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

export default class BandTag extends React.Component {

  render() {
    return (
      <View style={styles.bandTag}>
        <Text style={styles.bandName}>{this.props.data.name}</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  bandTag: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },
  icon: {
    height: 70,
    width: 70,
  },
  bandName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
