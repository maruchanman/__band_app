import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Modal,
  DatePickerIOS,
  ScrollView
} from 'react-native';
import LiveRow from './LiveRow.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const today = new Date();

export default class LiveList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lives: [],
      date: props.date
    }
  }

  _loadLives(date) {
    var url = 'http://160.16.217.99/b/lives/' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          lives: responseData
        })
      })
  }

  componentDidMount() {
    this._loadLives(this.state.date);
  }

  closeModal(navigator, date) {
    navigator.replace({name: "LiveList", visible: false, date: date});
  }

  setDate(date) {
    this.setState({date: date});
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Modal
          animationType={"slide"}
          visible={this.props.visible}
        >
          <View style={styles.modal}>
            <DatePickerIOS
              date={this.state.date}
              mode="date"
              onDateChange={(date) => this.setDate(date)}
              minimumDate={today}
              maximumDate={new Date(today.getFullYear(), today.getMonth() + 2, 0)}
              style={styles.datePicker}
            />
            <TouchableWithoutFeedback
              onPress={() => this.closeModal(this.props.navigator, this.state.date)}
            >
              <View>
                <Text style={styles.footer}>OK</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        {this.state.lives.map((live) => (
          <LiveRow live={live} key={live.liveID} push={this.props.navigator.push}/>
        ))}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'whitesmoke',
  },
  modal: {
    flex: 1,
    backgroundColor: 'gray',
  },
  datePicker: {
    height: 200,
    marginVertical: 100,
  },
  footer: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'dimgray'
  },
});
