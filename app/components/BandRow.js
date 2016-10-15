import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import BandTag from './BandTag.js';

export default class BandRow extends React.Component {

  render() {

    const goToBandPage = (bandData) => Actions.bandPage({data: bandData, type: ActionConst.FOCUS});

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => goToBandPage(this.props.rowData)}>
          <View style={styles.tag}>
            <BandTag data={this.props.rowData}/>
            <Icon name='chevron-right' color='gray' size={18}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  tag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
