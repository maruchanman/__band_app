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
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import LiveRow from './LiveRow.js';
import BandRow from './BandRow.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import CalendarPicker from 'react-native-calendar-picker';

const today = new Date();

class ModalCalendarPicker extends React.Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        visible={this.props.visible}
      >
        <View style={styles.modalHeader}>
          <TouchableWithoutFeedback onPress={() => this.props.closeCalendar(this.props.toggleModal)}>
            <View><Text style={styles.modalHeaderText}>OK</Text></View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.modalCalendar}>
          <CalendarPicker 
            selectedDate={this.props.date}
            onDateChange={(date) => this.props.setDate(date)}
            screenWidth={Dimensions.get('window').width}
            previousTitle="今月"
            nextTitle="翌月"
            selectedDayColor="#ff0000"
            weekdays={['日', '月', '火' , '水', '木', '金', '土']}
            minDate={today}
            maxDate={new Date(today.getFullYear(), today.getMonth() + 2, 0)}
            style={styles.datePicker}
          />
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
            autoCorrect={false}
            autoFocus={true}
            placeholderTextColor="gray"
            selectionColor="#ff0000"
            onChangeText={this.props.inputText}
            onSubmitEditing={this.props.search}
          />
          <View style={this.props.searching ? {} : styles.hidden}>
            <ActivityIndicator
              animating={true}
              style={{height: 80}}
              size="large"
            />
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
    <ActivityIndicator
      animating={true}
      style={{height: 80}}
      size="large"
    />
  </View>
);

export default class LiveList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lives: [],
      date: props.date,
      searchResults: [],
      searchRawResults: [],
      searchWord: "",
      loading: false,
      searching: false
    }
    this.setDate = this.setDate.bind(this);
    this.inputText = this.inputText.bind(this);
    this.search = this.search.bind(this);
    this.selectBand = this.selectBand.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
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
    this.setState({date: date});
  }

  closeCalendar(toggleModal) {
    this.setState({lives: [], loading: true});
    this._loadLives(this.state.date);
    toggleModal("calendar");
  }

  search() {
    this.setState({searching: true});
    var url = 'http://160.16.217.99/b/search/' + this.state.searchWord.substring(2, -1);
    fetch(url)
      .then((response) => response.json()) 
      .then((responseData) => {
        var searchRawResults = responseData;
        var filteredResults = searchRawResults.filter(
          (band) => band.name.toUpperCase().indexOf(this.state.searchWord.toUpperCase()) != -1
        );
        this.setState({
          searching: false, searchResults: filteredResults, searchRawResults: responseData})
        })
  }

  inputText(word) {
    if(this.state.searchRawResults.length > 0) {
      if(word.length > 1) {
        this.setState({searchResults: this.state.searchRawResults.filter(
          (band) => band.name.toUpperCase().indexOf(word.toUpperCase()) != -1
        )})
      } else {
        this.setState({searchResults: [], searchRawResults: []})
      }
    }
    this.setState({searchWord: word})
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
        <ModalCalendarPicker
          date={this.state.date}
          setDate={this.setDate}
          visible={this.props.visibleModal.calendar}
          toggleModal={this.props.toggleModal}
          closeCalendar={this.closeCalendar}/>
        <ModalSearch
          visible={this.props.visibleModal.search}
          toggleModal={this.props.toggleModal}
          searchResults={this.state.searchResults}
          inputText={this.inputText}
          searching={this.state.searching}
          selectBand={this.selectBand}
          searchWord={this.state.searchWord}
          search={this.search}
          navigator={this.props.navigator}/>
        {this.state.lives.map((live) => (
          <LiveRow
            live={live}
            key={live.liveID}
            push={this.props.navigator.push}
          />
        ))}
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
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
    flex: 11,
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
