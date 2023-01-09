import React from 'react';
import axios from 'axios';
import { Text, View, Button as TextButton, Image, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import Styles from '../Styles.js';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoComponent from './VideoComponent.jsx';
import AudioComponent from './AudioComponent.jsx';

function shuffleArray(array) {
  let newArray = [...array];
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    newArray = newArray.sort((a, b) => a.answered ? -1 : 1);
    return newArray;
}

class Topic extends React.Component {
  constructor(){
    super();
    this.state = {
      challenges: [],
      allChallengesAnswered: false
    }
    this.checkAnswerInput = this.checkAnswerInput.bind(this);
    this.handleResetTopic = this.handleResetTopic.bind(this);
  }

  async componentDidMount(){
    if(this.props.route.params){
      if(this.props.route.params.topicID){
        console.log('Fetching from:', process.env.STRAPI_URL);
        axios.get(`${process.env.STRAPI_URL}/topics/${this.props.route.params.topicID}?populate[challenges][populate][0]=FeaturedMedia`)
          .then(res => {
            if(res.data){
              const topic = res.data.data.attributes.Topic;
              this.setState({
                topic,
                challenges: res.data.data.attributes.challenges.data,
                loaded: true,
              });
            }
            if(this.props.completed){
              let completedChalleges = [];
              this.state.challenges.forEach((stateChallenge) => {
                stateChallenge.answered = 'correct';
                completedChalleges.push(stateChallenge);
              });
              this.setState({
                challenges: completedChalleges,
                inChallengeMode: true,
                allChallengesAnswered: true,
              });
            }
          })
      }
    }

  }

  async checkAnswerInput(input, challenge){
    if(input.toLowerCase() == challenge.Title.toLowerCase()){
      const newState = this.state;
      const challengeIndex = newState.challenges.indexOf(challenge);
      challenge.answered = 'correct';
      newState.challenges[challengeIndex] = challenge;
      this.setState({ ...newState });
    }

    // Check to see if all challenges have been answered correctly
    let allChallengesAnswered = true;
    this.state.challenges.forEach((challenge) => {
      if(!challenge.answered){
        allChallengesAnswered = false;
      }
    });
    if(allChallengesAnswered){
      Alert.alert('Congratulations! You have answered each challenge correctly.');
      axios.post(`${process.env.APP_SERVER_URL}/level/${this.props.route.params.levelID}/topics/${this.props.route.params.topicID}`)
        .then(res => {
          if(res.data){
            console.log(res.data)
          }
        })
      this.setState({
        allChallengesAnswered
      });
    }
  }

  async handleResetTopic(){
    axios.post(`${process.env.APP_SERVER_URL}/level/${this.props.route.params.levelID}/topics/${this.props.route.params.topicID}/reset`)
    this.setState({
      allChallengesAnswered: false
    });
    let completedChalleges = [];
    this.state.challenges.forEach((stateChallenge) => {
      delete stateChallenge.answered;
      completedChalleges.push(stateChallenge);
    });
    this.setState({
      challenges: completedChalleges
    });
  }

  renderMedia(challenge){
    if(challenge.attributes.FeaturedMedia){
      if(challenge.attributes.FeaturedMedia.data){
        switch(challenge.attributes.FeaturedMedia.data.attributes.mime){
          case 'image/jpeg':
            return (
              <View style={Styles.fullWidth}>
                <Image source={{uri: `${process.env.STRAPI_PUBLIC_URL}${challenge.attributes.FeaturedMedia.data.attributes.url}`}}
                  style={{height: 400, width: '100%'}}
                />
              </View>
            );
          case 'video/mp4':
            return (
              <VideoComponent video={{ src: `${process.env.STRAPI_PUBLIC_URL}${challenge.attributes.FeaturedMedia.data.attributes.url}` }}/>
            );
          case 'audio/wav':
          case 'audio/mp3':
          case 'audio/mpeg':
            return (
              <View style={{
                position: 'relative',
                height: 225,
                width: 400,
                backgroundImage: `url('${process.env.APP_SERVER_URL + '/' + "/images/videoPlaceholder.png"}')`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                borderRadius: 25,
                overflow: 'hidden',
                maxWidth: '100%',
              }}>
                <AudioComponent src={`${process.env.STRAPI_PUBLIC_URL}${challenge.attributes.FeaturedMedia.data.attributes.url}`}/>
              </View>
            );
          default:
            return <Text>Invalid media</Text>
        }
      }
    }
  }

  render(){
    return (
      <ScrollView>
          {this.state.challenges ?
            <ScrollView horizontal style={{ maxHeight: 100 }}>
              {shuffleArray(this.state.challenges).map((challenge) =>
                <View key={this.state.challenges.indexOf(challenge)}>
                  <View style={Styles.pad}>
                    <View>
                      <Button icon={challenge.answered ? 'check-circle' : ''} labelStyle={challenge.answered ? {color: 'green'} : {}}>
                        {challenge.attributes.Title}
                      </Button>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
            :
            <Text>No options</Text>
          }

        <View style={Styles.pad}>
          <Text style={Styles.heading}>{this.state.topic}</Text>
        </View>
        {this.state.allChallengesAnswered ?
            <View style={Styles.pad}>
            <Button icon="sync" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={this.handleResetTopic}>
              Reset Topic
            </Button>
            </View>
            :
            <Text></Text>
          }
          {this.state.challenges ?
            <View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
              {this.state.challenges.map((challenge) =>
                <View key={challenge.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
                  <View>
                    <View style={Styles.pad}>
                      <Button icon={challenge.answered ? 'check-circle' : ''} labelStyle={{color: 'green'}} style={challenge.answered ? {} : {opacity: 0}}>
                        Correct!
                      </Button>
                      <TextInput mode="outlined" placeholder="Guess meaning" onChangeText={(text) => this.checkAnswerInput(text, challenge)}/>
                      <View style={{...Styles.pad, ...Styles.noXPad}}>
                        <Text>{challenge.attributes.Content}</Text>
                      </View>
                    </View>
                    {challenge.attributes.FeaturedMedia.data ?
                      <View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
                        {this.renderMedia(challenge)}
                      </View>
                      :
                      <Text></Text>
                    }
                    {this.state.allChallengesAnswered ?
                      <View style={{...Styles.flex, ...Styles.xCenter}}>
                        <View style={Styles.halfPad}>
                        <Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
                            this.props.navigation.navigate('Videos', {keywords: challenge.attributes.Title})
                          }>View others</Button>
                        </View>
                        <View style={Styles.halfPad}>
                        <Button icon="plus" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
                            this.props.navigation.navigate('Add Video', {challenge: challenge.attributes.Title})
                          }>Submit your own</Button>
                        </View>
                      </View>
                      :
                      <Text></Text>
                    }
                  </View>
                </View>
              )}
            </View>
            :
            <Text>No challenges</Text>
          }
      </ScrollView>
    );
  }
}

export default Topic;
