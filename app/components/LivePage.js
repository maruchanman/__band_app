import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BandRow from './BandRow.js';

export default class LivePage extends React.Component {

  render() {

    console.log(this.props.live);

    var dateStr = String(this.props.live.yyyymmdd);
    var y = dateStr.slice(0, 4);
    var m = dateStr.slice(4, -2);
    var d = dateStr.slice(-2,);
    var date = new Date(Number(y), Number(m), Number(d));
    let weeks = ["日", "月", "火", "水", "木", "金", "土"];
    var w = weeks[date.getDay()];

    return (
      <ScrollView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.livehouse}>{this.props.live.name}</Text>
          <View style={styles.info}>
            <Text style={styles.infoText}>{y}/{m}/{d}({w})</Text>
          </View>
          <View style={styles.info}>
            <Icon color="black" size={16} name="clock-o"/>
            <Text style={styles.infoText}>{this.props.live.open}</Text>
            <Icon color="black" size={16} name="jpy"/>
            <Text style={styles.infoText}>{this.props.live.ticket}</Text>
          </View>
          <Image source={{uri: this.props.live.image}} style={styles.image}/>
          <Text style={styles.context}>{this.props.live.context}</Text>
        </View>
        <View style={styles.box}>
          <Text style={{color: 'gray'}}>出演</Text>
          {this.props.live.act.map((band) => (
            <BandRow key={band.bandID} band={band} push={this.props.navigator.push}/>
          ))}
        </View>
        <View>
          <TouchableWithoutFeedback onPress={() => Linking.openURL(this.props.live.url)}>
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
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'white'
  },
  livehouse: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  image: {
    flex: 1,
    minHeight: 200
  },
  info: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 16,
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
