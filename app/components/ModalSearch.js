import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextField from 'react-native-md-textinput';

export default class ModalSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: props.hide
    }
    this.dismissModal = this.dismissModal.bind(this)
  }

  dismissModal() {
    this.setState({hide: true});
    Actions.pop();
  }

  render() {

    if(this.state.hide){
      return (
        <View>
        </View>
      )
    } else {
        return (
          <View style={styles.modal}>
            <Icon.Button name='times' style={styles.button} color='gray' backgroundColor="whitesmoke" size={22} onPress={() => this.dismissModal()} />
            <TextField style={styles.input} label={'バンド'} highlightColor ={'orangered'} />
          </View>
        )
      }
  }
}

const styles = StyleSheet.create({

  modal: {
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('window').height,
    backgroundColor: 'whitesmoke',
    paddingHorizontal: 50,
  },
})
