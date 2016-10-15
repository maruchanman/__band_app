import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafariView from 'react-native-safari-view';

import BandRow from './BandRow.js';

export default class LivePage extends React.Component {

  render() {

    const goToWebPage = (url) => Actions.webPage({url: url});

    let live = this.props.data;
    console.log(live);

    var dateStr = String(live.yyyymmdd);
    var y = dateStr.slice(0, 4);
    var m = dateStr.slice(4, -2);
    var d = dateStr.slice(-2,);
    var date = new Date(Number(y), Number(m), Number(d));
    let weeks = ["日", "月", "火", "水", "木", "金", "土"];
    var w = weeks[date.getDay()];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.infobox}>
          <Text style={styles.livehouse}>{live.name}</Text>
          <View style={styles.info}>
            <Icon name='calendar' color='black' size={18}/>
            <Text style={styles.infoText}>{y}/{m}/{d}({w})</Text>
          </View>
          <View style={styles.info}>
            <Icon name='clock-o' color='black' size={18}/>
            <Text style={styles.infoText}>{live.open}</Text>
            <Icon name='jpy' color='black' size={18}/>
            <Text style={styles.infoText}>{live.ticket}</Text>
          </View>
          <Image source={{uri: live.image}} style={{flex: 1, minHeight: 200}}/>
          <Text style={styles.context}>{live.context}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{color: 'gray'}}>出演</Text>
          {live.act.map((rowData) => (
            <BandRow key={rowData.bandID} rowData={rowData} />
          ))}
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => goToWebPage('http://' + live.homepage)}>
            <View style={styles.box}>
              <Text style={styles.link}>掲載元ページへ</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    )

  }

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    backgroundColor: 'whitesmoke',
  },
  box: {
    margin: 5,
    padding: 10,
    backgroundColor: 'white'
  },
  infobox: {
    margin: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  livehouse: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  info: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  context: {
    color: 'gray',
    fontSize: 14,
  },
  label: {
    fontSize: 18,
    paddingVertical: 2,
    paddingHorizontal: 10,
    fontWeight: 'bold'
  },
  link: {
    paddingVertical: 10,
    fontSize: 16,
    alignSelf: 'center',
    color: 'gray'
  }
});
