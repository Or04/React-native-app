import React, { Component } from 'react'
import { FlatList, StyleSheet, View, Image, Alert, TouchableHighlight } from 'react-native'
import { Button } from 'react-native-elements'
import { partiesImages } from '../img'
const styles = StyleSheet.create({
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100
  },
  partyList: {
    flex: 1,
    flexDirection: 'column',
    margin: 1
  }
})

export default class PartiesList extends Component {
  constructor(props) {
    super(props)
    this.showAlert = this.showAlert.bind(this)
    this.handleVote = this.handleVote.bind(this)
    this.state = {
      parties: []
    }
  }
  showAlert(index) {
    Alert.alert(
      `האם אתה בטוח שאתה רוצה לבחור ב:${this.state.parties[index].id}`,
      '',
      [
        {
          text: 'ביטול',
          onPress: () => '',
          style: 'cancel'
        },
        { text: 'אישור', onPress: () => this.handleVote(index) }
      ],
      { cancelable: false }
    )
  }
  handleVote(index) {
    fetch(`https://isr-elections.herokuapp.com/api/parties/vote/${this.state.parties[index].id}`, {
      method: 'post'
    }).then(response => {
      if (response.status === 200) {
        Alert.alert('הצבעתך התקבלה-נתראה ב9 באפריל!!')
      }
    })
  }
  async componentDidMount() {
    await fetch('https://isr-elections.herokuapp.com/api/parties/')
      .then(response => {
        return response.json()
      })
      .then(res => {
        const partyArray = Object.values(res)
        for (let i = 0; i < 15; i++) {
          this.setState(prevState => ({
            parties: [
              ...prevState.parties,
              {
                id: partyArray[0][i].id
              }
            ]
          }))
        }
      })
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'בחירות ישראל 2019',

    headerStyle: {
      backgroundColor: 'rgb(247, 206, 204)'
    },
    headerTitleStyle: {
      fontSize: 25,
      left: 75,
      color: '#ffffff'
    },

    headerLeft: <Button onPress={() => navigation.navigate('TopFive')} title="Status" />
  })
  render() {
    return (
      <FlatList
        data={this.state.parties}
        renderItem={({ index }) => (
          <View key={index} style={styles.partyList}>
            <TouchableHighlight onPress={() => this.showAlert(index)}>
              <Image style={styles.imageThumbnail} source={{ uri: partiesImages[index] }} />
            </TouchableHighlight>
          </View>
        )}
        //Setting the number of column
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
    )
  }
}
