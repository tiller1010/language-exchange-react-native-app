import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from '../Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoComponent from './VideoComponent.jsx';
import AudioComponent from './AudioComponent.jsx';

// Enable lazy loading
// const lozadObserver = lozad();
// lozadObserver.observe();

function renderTopicMedia(FeaturedMedia) {
  if (FeaturedMedia) {
    if (FeaturedMedia.data) {
      switch (FeaturedMedia.data.attributes.mime) {
        case 'image/jpeg':
          return (
            <View className="img-container desktop-100">
              <Image source={{uri: `${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}}
                style={{height: 400, width: '100%'}}
              />
            </View>
          );
        default:
          return <Text>Invalid media</Text>
      }
    }
  }
  return <Text>Invalid media</Text>
}

function renderChallengeMedia(FeaturedMedia){
  if(FeaturedMedia){
    if(FeaturedMedia.data){
      switch(FeaturedMedia.data.attributes.mime){
        case 'image/jpeg':
          return (
            <View className="img-container">
              <Image source={{uri: `${process.env.STRAPI_PUBLIC_URL}${FeaturedMedia.data.attributes.url}`}}
                style={{height: 400, width: '100%'}}
              />
            </View>
          );
        case 'video/mp4':
          return (
            <VideoComponent video={data.attributes}/>
          );
        case 'audio/wav':
        case 'audio/mp3':
        case 'audio/mpeg':
          return (
            <AudioComponent video={data.attributes}/>
          );
        default:
          return <Text>Invalid media</Text>
      }
    }
  }
}

export default function TopicLink(props) {

  let { topic, levelID, showChallenge } = props;

  /*
    If topic was completed and saved with Strapi 3,
    format like Strapi 4 API
  */
  if (!topic.attributes) {
    topic.attributes = { ...topic };
    topic.attributes.FeaturedMedia = { data: { attributes: { ...topic.FeaturedImage } } };
    topic.attributes.FeaturedMedia.data.attributes.alternativeText = topic.FeaturedImage.name;
  }

  let challenge = null;
  if (topic.attributes.challenges) {
    challenge = topic.attributes.challenges.data[0];
  }

  return (
    <View>
      <View className="flex x-space-between y-center" style={{ flexWrap: 'nowrap' }}>
        <Text className="pad no-y no-left">{topic.attributes.Topic}</Text>
        <Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
          props.navigation.navigate('Topic', {levelID, topicID: topic.id})
        }>{topic.Topic}</Button>
      </View>
      {renderTopicMedia(topic.attributes.FeaturedMedia)}
      {showChallenge && challenge ?
        <View className="challenge">
          <View className="pad">
            <Text>{challenge.attributes.Title}</Text>
            <Text>{challenge.attributes.Content}</Text>
            {renderChallengeMedia(challenge.attributes.FeaturedMedia)}
          </View>
        </View>
        :
        ''
      }
    </View>
  );
}
