import React from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ModalCalendar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: props.hide,
      date: props.date ? props.date : new Date() 
    }
    this.dismissModal = this.dismissModal.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
  }

  dismissModal() {
    this.setState({hide: true});
    Actions.pop();
  }

  onDateChange(date) {
    this.setState({hide: true, date: date});
    Actions.pop();
    setTimeout(() => {
      Actions.refresh({date: date});
    }, 10);
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
            <CalendarPicker 
              selectedDate={this.state.date}
              onDateChange={this.onDateChange}
              screenWidth={Dimensions.get('window').width}
              selectedBackgroundColor={'#5ce600'} />
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
    backgroundColor: 'whitesmoke'
  },

})
