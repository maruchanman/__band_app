import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BandRow extends React.Component {

  render() {

    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.push({name: "BandPage", band: this.props.band})}>
        <View style={styles.row}>
          <Text style={styles.infoText}>{this.props.band.name}</Text>
          <Icon color="gray" size={16} name="chevron-right"/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
