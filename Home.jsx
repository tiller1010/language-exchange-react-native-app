import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import VideoComponent from './VideoComponent.jsx';
import ReadMore from '@kangyoosam/react-native-readmore';

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
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleUserProfileNavigation = this.handleUserProfileNavigation.bind(this);
		this.sendLike = this.sendLike.bind(this);
		this.removeLike = this.removeLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
	}

	async componentDidMount(){
		// Get recent videos
		console.log('Fetching from:', process.env.APP_SERVER_URL);
		axios.get(`${process.env.APP_SERVER_URL}/recent-videos`)
			.then(res => {
				console.log(res)
				this.setState({
					recentVideos: res.data.videos
				});
			});

		console.log('Fetching from:', process.env.STRAPI_URL);
		axios.get(`${process.env.STRAPI_URL}/levels`)
			.then(res => {
				this.setState({
					levels: res.data
				});
			})
	}

	toggleSortControls(){
		let newStatus = this.state.sortControlStatus ? '' : 'visible';
		this.setState({
			sortControlStatus: newStatus
		});
	}

	handleSortChange(value){
		this.setState({
			sort: value,
			sortControlStatus: ''
		}, () => {
			this.props.navigation.navigate('Videos', {sort: this.state.sort, keywords: this.state.keywords || ''});
		});
	}

	async sendLike(video){
		const newLikedVideo = await fetch(`${process.env.APP_SERVER_URL}/sendLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newLikedVideo.message){
			// Display error message if included in response
			alert(newLikedVideo.message);
		} else if(newLikedVideo) {
			// Update the video state to be liked by the current user. Used immediately after liking.
			newLikedVideo.likedByCurrentUser = true;
			let newVideos = this.state.recentVideos;
			newVideos[newVideos.indexOf(video)] = newLikedVideo;
			// Add video to user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = this.state.userLikedVideos;
			newUserLikedVideos.push(video);
			this.setState({
				recentVideos: newVideos,
				userLikedVideos: newUserLikedVideos
			});
		}
	}

	async removeLike(video){
		const newUnlikedVideo = await fetch(`${process.env.APP_SERVER_URL}/removeLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newUnlikedVideo.message){
			// Display error message if included in response
			alert(newUnlikedVideo.message);
		} else if(newUnlikedVideo) {
			// Update the video state to remove like from the current user. Used immediately after unliking.
			newUnlikedVideo.likedByCurrentUser = false;
			let newVideos = this.state.recentVideos;
			newVideos[newVideos.indexOf(video)] = newUnlikedVideo;
			// Remove video from user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = [];
			this.state.userLikedVideos.forEach((userLikedVideo) => {
				if(userLikedVideo._id != video._id){
					newUserLikedVideos.push(userLikedVideo);
				}
			});
			this.setState({
				recentVideos: newVideos,
				userLikedVideos: newUserLikedVideos
			});
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

	renderMedia(topic){
		if(topic.FeaturedImage){
			switch(topic.FeaturedImage.mime){
				case 'image/jpeg':
					return (
						<View style={Styles.fullWidth}>
							<Image source={{uri: `${process.env.STRAPI_URL}${topic.FeaturedImage.url}`}}
								style={{height: 400, width: '100%'}}
							/>
						</View>
					);
				default:
					return <Text>Invalid media</Text>
			}
		}
	}

	randomTopics(level){
		if(level.topicsRandomized){
			return level.topics;
		} else {
			level.topicsRandomized = true;
			level.topics = level.topics.sort(() => .5 - Math.random()).slice(0, 5);
			return level.topics;
		}
	}

	async handleUserProfileNavigation(userID){
		let user = await fetch(`${process.env.APP_SERVER_URL}/user/${userID}`)
			.then((response) => response.json())
			.catch((e) => console.log(e));
		this.props.navigation.navigate('Account Profile', { user });
	}

	render(){
		
		var apiBaseURL = process.env.APP_SERVER_URL;

		return(
			<ScrollView>
				<View style={Styles.pad}>
					<Text>Let's enjoy your</Text>
					<Text style={Styles.heading}>User Submissions</Text>
					<View>
						<Searchbar type="text" placeholder="Search video submissions" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
							style={{
								borderWidth: 1,
								borderColor: 'black'
							}}
							onIconPress={() => this.props.navigation.navigate('Videos', {keywords: this.state.keywords})}
							onSubmitEditing={() => this.props.navigation.navigate('Videos', {keywords: this.state.keywords})}
						/>
						<View style={{...Styles.flex, ...Styles.xCenter}}>
							<View style={Styles.halfPad}>
								<Menu
									anchor={<Button onPress={this.toggleSortControls} icon="tune" mode="contained" labelStyle={{color: 'white'}}>Search & Sort</Button>}
									visible={this.state.sortControlStatus}
								>
									<RadioButton.Group>
										<RadioButton.Item label="All" name="sort" value="" status={this.state.sort === '' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('')}/>
										<RadioButton.Item label="Oldest" name="sort" value="Oldest" status={this.state.sort === 'Oldest' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Oldest')}/>
										<RadioButton.Item label="Recent" name="sort" value="Recent" status={this.state.sort === 'Recent' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Recent')}/>
										<RadioButton.Item label="A-Z" name="sort" value="A-Z" status={this.state.sort === 'A-Z' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('A-Z')}/>
										<RadioButton.Item label="Z-A" name="sort" value="Z-A" status={this.state.sort === 'Z-A' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Z-A')}/>
									</RadioButton.Group>
									<Menu.Item icon="close" title="Close" onPress={this.toggleSortControls}/>
								</Menu>
							</View>
							<View style={Styles.halfPad}>
								<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={() =>
									this.props.navigation.navigate('Videos', {keywords: this.state.keywords})
								}>Search Videos</Button>
							</View>
						</View>
					</View>
				</View>

				<View style={Styles.pad}>
					<Text style={Styles.subHeading}>Recent Submissions</Text>
				</View>
				<ScrollView horizontal>
			    	{this.state.recentVideos.map((video) => 
			    		<View key={video._id} style={{width: 300}}>
				    		<View style={{...Styles.pad}}>
								<View style={{ ...Styles.flex, ...Styles.xSpaceBetween }}>
									<View style={{ maxWidth: 160 }}>
										<ReadMore
											numberOfLines={1}
										>
											<Text style={Styles.subHeading}>{video.title}</Text>
										</ReadMore>
									</View>
									{video.uploadedBy._id ?
										<View>
											<TextButton title={`By: ${video.uploadedBy.displayName}`} onPress={() => this.handleUserProfileNavigation(video.uploadedBy._id)}/>
										</View>
										:
										<View>
											<Text>By: {video.uploadedBy.displayName}</Text>
										</View>
									}
								</View>
								<VideoComponent video={video}/>
							</View>
							<View style={{ ...Styles.flex, ...Styles.xSpaceAround, ...Styles.yCenter }}>
								<Text>Likes: {video.likes || 0}</Text>
								{video.likedByCurrentUser ?
									<Button icon="star" onPress={() => this.removeLike(video)}>
										Liked
									</Button>
									:
									<Button icon="star-outline" onPress={() => this.sendLike(video)}>
										Like
									</Button>
								}
							</View>
						</View>
		    		)}
				</ScrollView>

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<View key={level.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
				    		<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
									this.props.navigation.navigate('Level', {levelID: level.id})
								}
							>{`Level ${level.Level}`}</Button>
				    		{level.topics ?
				    			<View style={Styles.fullWidth}>
					    			{this.randomTopics(level).map((topic) =>
				    					<View key={topic.id} style={Styles.fullWidth}>
						    					<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
													this.props.navigation.navigate('Topic', {levelID: level.id, topicID: topic.id})
												}>{topic.Topic}</Button>
						    					{this.renderMedia(topic)}
				    					</View>
				    				)}
			    				</View>
			    				:
			    				<Text>Loading</Text>
				    		}
			    		</View>
		    		) 
			    	:
			    	<Text>Loading</Text>
			    }
			</ScrollView>
		);
	}
}

export default Home;