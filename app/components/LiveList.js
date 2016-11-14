import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Modal,
  DatePickerIOS,
  ScrollView
} from 'react-native';
import LiveRow from './LiveRow.js';
import BandRow from './BandRow.js';
import Icon from 'react-native-vector-icons/FontAwesome';

const today = new Date();

class ModalCalendar extends React.Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        visible={this.props.visible}
      >
        <View style={styles.modalCalendar}>
          <DatePickerIOS
            date={this.props.date}
            mode="date"
            onDateChange={(date) => this.props.setDate(date)}
            minimumDate={today}
            maximumDate={new Date(today.getFullYear(), today.getMonth() + 2, 0)}
            style={styles.datePicker}
          />
          <TouchableWithoutFeedback onPress={() => this.props.toggleModal("calendar")}>
            <View><Text style={styles.footer}>OK</Text></View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    )
  }
}

class ModalSearch extends React.Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        visible={this.props.visible}
      >
        <View style={styles.modalHeader}>
          <TouchableWithoutFeedback onPress={() => this.props.toggleModal("search")}>
            <View><Text style={styles.modalHeaderText}>キャンセル</Text></View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.modalSearch}>
          <TextInput
            value={this.props.searchWord}
            style={styles.textInput}
            placeholder="バンド名"
            placeholderTextColor="gray"
            selectionColor="red"
            onChangeText={(text) => this.props.inputText(text)}
            onSubmitEditing={this.props.subSearch}
          />
          <View style={this.props.searching ? styles.loading : styles.hidden}>
            <Icon style={styles.loadingText} name="spinner" size={40} color="gray"/>
          </View>
          <View style={this.props.searching ? styles.hidden : {}}>
            {this.props.searchResults.map((band) => (
              <TouchableWithoutFeedback
                key={band.bandID}
                onPress={() => this.props.selectBand(
                  band, this.props.navigator, this.props.toggleModal)}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowBandName}>{band.name}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </Modal>
    )
  }
}

const Loading = props => (
  <View style={props.loading ? styles.loading : styles.hidden}>
    <Icon style={styles.loadingText} name="spinner" size={40} color="gray"/>
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

export default class LiveList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lives: [],
      date: props.date,
      searchWord: "",
      searchResults: [],
      loading: false,
      searching: false
    }
    this.setDate = this.setDate.bind(this);
    this.inputText = this.inputText.bind(this);
    this.subSearch = this.subSearch.bind(this);
    this.selectBand = this.selectBand.bind(this);
  }

  _loadLives(date) {
    var url = 'http://160.16.217.99/b/lives/' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => this.setState({lives: responseData, loading: false}))
  }

  componentDidMount() {
    this.setState({loading: true});
    this._loadLives(this.state.date);
  }

  setDate(date) {
    this.setState({date: date, lives: [], loading: true});
    this._loadLives(date);
  }

  subSearch() {
    this.setState({searcing: true});
    this.search(this.state.searchWord);
  }
  
  search(word) {
    var url = 'http://160.16.217.99/b/search/' + word;
    fetch(url)
      .then((response) => response.json()) 
      .then((responseData) => this.setState({searching: false, searchResults: responseData}))
  }

  inputText(word) {
    this.setState({searchWord: word});
  }

  selectBand(band, navigator, toggleModal) {
    navigator.push({name: "BandPage", band: band});
    toggleModal("search");
    this.setState({searchResults: []})
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Loading loading={this.state.loading}/>
        <ModalCalendar
          date={this.state.date}
          setDate={this.setDate}
          visible={this.props.visibleModal.calendar}
          toggleModal={this.props.toggleModal}/>
        <ModalSearch
          visible={this.props.visibleModal.search}
          toggleModal={this.props.toggleModal}
          searchResults={this.state.searchResults}
          subSearch={this.subSearch}
          inputText={this.inputText}
          searching={this.state.searching}
          searchWord={this.state.searchWord}
          selectBand={this.selectBand}
          navigator={this.props.navigator}/>
        {this.state.lives.map((live) => (
          <LiveRow live={live} key={live.liveID} push={this.props.navigator.push}/>
        ))}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
  },
  loading: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  loadingText: {
    textAlign: 'center',
    color: 'gray',
    fontWeight: 'bold',
    height: 70,
    fontSize: 20
  },
  hidden: {
    height: 0,
    opacity: 0
  },
  modalCalendar: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  modalSearch: {
    flex: 11,
    backgroundColor: 'whitesmoke',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  modalHeader: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  modalHeaderText: {
    color: 'gray',
    textAlign: 'right'
  },
  datePicker: {
    height: 200,
    marginVertical: 100,
  },
  footer: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray'
  },
  textInput: {
    height: 40,
    marginBottom: 40
  },
  resultRow: {
    height: 40,
    backgroundColor: 'whitesmoke'
  },
  resultRowBandName: {
    fontWeight: 'bold',
    color: 'gray'
  }
});
