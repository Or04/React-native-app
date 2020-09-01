import React, { Component } from 'react'
import { Button } from 'react-native-elements'
import { ScrollView } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardImage } from 'react-native-cards'
import { partiesImages } from '../img'
import { parties } from '../parties'
const tempArray = []

const compareFunction = (a, b) => {
  if (a.votes > b.votes) {
    return -1
  } else if (a.votes < b.votes) {
    return 1
  }
  return 0
}
export default class TopFive extends Component {
  constructor(props) {
    super(props)

    this.state = {
      parties: [],
      topFive: [],
      sum: 0
    }
  }
  async componentDidMount() {
    await fetch('https://isr-elections.herokuapp.com/api/parties/poll-status')
      .then(response => {
        return response.json()
      })
      .then(res => {
        const partyArray = Object.values(res)
        for (let i = 0; i < parties.length; i++) {
          this.setState(prevState => ({
            sum: this.state.sum + partyArray[i].currentVotes,
            parties: [
              ...prevState.parties,
              {
                id: parties[i],
                votes: partyArray[i].currentVotes,
                imgSrc: partiesImages[i]
              }
            ]
          }))
        }
      })
      .then(() => {
        this.state.parties.sort(compareFunction)
        for (let i = 0; i < 5; i++) {
          tempArray[i] = this.state.parties[i]
        }
        this.forceUpdate()
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
    headerLeft: <Button onPress={() => navigation.navigate('Home')} title="vote" />
  })
  render() {
    return (
      <ScrollView>
        {tempArray.map((u, i) => {
          return (
            <Card key={i}>
              <CardImage source={{ uri: u.imgSrc }} />
              <CardTitle subtitle={u.id} />
              <CardContent text={((u.votes / this.state.sum) * 100).toFixed(2) + '%'} />
              <CardAction separator inColumn={false} />
            </Card>
          )
        })}
      </ScrollView>
    )
  }
}
