import React from 'react';
import axios from 'axios';
import { Text, View, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import VideoPlayer from './VideoPlayer.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LessonsFeed from './LessonsFeed.jsx';
import VideoSearchForm from './VideoSearchForm.jsx';
import HomepageBanner from './HomepageBanner.jsx';

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
		// this.toggleSortControls = this.toggleSortControls.bind(this);
		// this.handleSortChange = this.handleSortChange.bind(this);
		// this.sendLike = this.sendLike.bind(this);
		// this.removeLike = this.removeLike.bind(this);
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

	// toggleSortControls(){
	// 	let newStatus = this.state.sortControlStatus ? '' : 'visible';
	// 	this.setState({
	// 		sortControlStatus: newStatus
	// 	});
	// }

	// handleSortChange(value){
	// 	this.setState({
	// 		sort: value,
	// 		sortControlStatus: ''
	// 	}, () => {
	// 		this.props.navigation.navigate('Videos', {sort: this.state.sort, keywords: this.state.keywords || ''});
	// 	});
	// }

	// async sendLike(video){
	// 	const newLikedVideo = await fetch(`${process.env.APP_SERVER_URL}/sendLike/${video._id}`)
	// 		.then(res => res.json())
	// 		.catch(error => console.log(error));
	// 	if(newLikedVideo.message){
	// 		// Display error message if included in response
	// 		alert(newLikedVideo.message);
	// 	} else if(newLikedVideo) {
	// 		// Update the video state to be liked by the current user. Used immediately after liking.
	// 		newLikedVideo.likedByCurrentUser = true;
	// 		let newVideos = this.state.recentVideos;
	// 		newVideos[newVideos.indexOf(video)] = newLikedVideo;
	// 		// Add video to user's liked videos. Used when a re-render occurs.
	// 		let newUserLikedVideos = this.state.userLikedVideos;
	// 		newUserLikedVideos.push(video);
	// 		this.setState({
	// 			recentVideos: newVideos,
	// 			userLikedVideos: newUserLikedVideos
	// 		});
	// 	}
	// }

	// async removeLike(video){
	// 	const newUnlikedVideo = await fetch(`${process.env.APP_SERVER_URL}/removeLike/${video._id}`)
	// 		.then(res => res.json())
	// 		.catch(error => console.log(error));
	// 	if(newUnlikedVideo.message){
	// 		// Display error message if included in response
	// 		alert(newUnlikedVideo.message);
	// 	} else if(newUnlikedVideo) {
	// 		// Update the video state to remove like from the current user. Used immediately after unliking.
	// 		newUnlikedVideo.likedByCurrentUser = false;
	// 		let newVideos = this.state.recentVideos;
	// 		newVideos[newVideos.indexOf(video)] = newUnlikedVideo;
	// 		// Remove video from user's liked videos. Used when a re-render occurs.
	// 		let newUserLikedVideos = [];
	// 		this.state.userLikedVideos.forEach((userLikedVideo) => {
	// 			if(userLikedVideo._id != video._id){
	// 				newUserLikedVideos.push(userLikedVideo);
	// 			}
	// 		});
	// 		this.setState({
	// 			recentVideos: newVideos,
	// 			userLikedVideos: newUserLikedVideos
	// 		});
	// 	}
	// }

	currentUserHasLikedVideo(video){
		let liked = false;
		this.state.userLikedVideos.forEach((userLikedVideo) => {
			if(userLikedVideo._id === video._id){
				liked = true;
			}
		});
		return liked;
	}

	// renderMedia(topic){
	// 	if(topic.FeaturedImage){
	// 		switch(topic.FeaturedImage.mime){
	// 			case 'image/jpeg':
	// 				return (
	// 					<View style={Styles.fullWidth}>
	// 						<Image source={{uri: `${process.env.STRAPI_URL}${topic.FeaturedImage.url}`}}
	// 							style={{height: 400, width: '100%'}}
	// 						/>
	// 					</View>
	// 				);
	// 			default:
	// 				return <Text>Invalid media</Text>
	// 		}
	// 	}
	// }

	// randomTopics(level){
	// 	if(level.topicsRandomized){
	// 		return level.topics;
	// 	} else {
	// 		level.topicsRandomized = true;
	// 		level.topics = level.topics.sort(() => .5 - Math.random()).slice(0, 5);
	// 		return level.topics;
	// 	}
	// }

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

			</ScrollView>
		);
	}
}

export default Home;