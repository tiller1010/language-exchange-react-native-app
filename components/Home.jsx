import React from 'react';
import axios from 'axios';
import { Text, View, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from '../Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import VideoPlayer from './VideoPlayer.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LessonsFeed from './LessonsFeed.jsx';
import VideoSearchForm from './VideoSearchForm.jsx';
import HomepageBanner from './HomepageBanner.jsx';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.jsx';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      keywords: '',
      sort: '',
      sortControlStatus: '',
      recentVideos: [],
      userLikedVideos: []
    }
    this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
  }

  async componentDidMount(){
    // Get recent videos
    console.log('Fetching from:', process.env.APP_SERVER_URL);
    axios.get(`${process.env.APP_SERVER_URL}/recent-videos`)
      .then(res => {
        this.setState({
          recentVideos: res.data.videos
        });
      })
      .catch((e) => console.log(e));


    var authenticatedUser = await AsyncStorage.getItem('@user');
    if(authenticatedUser){
      authenticatedUser = JSON.parse(authenticatedUser);
      if(authenticatedUser.userLikedVideos){
        this.setState({
          userLikedVideos: authenticatedUser.userLikedVideos
        });
      }
    }
  }

  currentUserHasLikedVideo(video){
    let liked = false;
    this.state.userLikedVideos.forEach((userLikedVideo) => {
      if(userLikedVideo._id === video._id){
        liked = true;
      }
    });
    return liked;
  }

  render(){

    var apiBaseURL = process.env.APP_SERVER_URL;

    return(
      <ScrollView>

        <HomepageBanner navigation={this.props.navigation}/>

          <LessonsFeed HideClearFilters={true}/>

        <View style={Styles.pad}>
          <Text>Let's enjoy your</Text>
          <Text style={Styles.heading}>Browse and upload words and phrases.</Text>
          <View>
            <VideoSearchForm
              keywords=""
              sort="Recent"
            />
          </View>
        </View>

        <View style={Styles.pad}>
          <Text style={Styles.subHeading}>Recent User Uploads</Text>
        </View>
        <ScrollView horizontal>
            {this.state.recentVideos.map((video) =>
              <View key={video._id} style={{width: 300}}>
                <View style={{...Styles.pad}}>
                <VideoPlayer
                  _id={video._id}
                  title={video.title}
                  languageOfTopic={video.languageOfTopic}
                  src={process.env.APP_SERVER_URL + '/' + video.src}
                  thumbnailSrc={video.thumbnailSrc ? process.env.APP_SERVER_URL + '/' + video.thumbnailSrc : ''}
                  uploadedBy={video.uploadedBy}
                  likes={video.likes}
                  likedByCurrentUser={this.currentUserHasLikedVideo(video)}
                  authenticatedUserID={this.state.userID}
                />
              </View>
            </View>
            )}
        </ScrollView>

        <View>
          <View>
            <View>

              <View>
                <Text>Chat with a native speaker.</Text>
              </View>

              <View>
                <PremiumVideoChatListingFeed authenticatedUserID={this.state.userID} HideClearFilters={true}/>
              </View>

            </View>
          </View>
        </View>

      </ScrollView>
    );
  }
}

export default Home;
