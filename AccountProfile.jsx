import React from 'react';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu, Headline } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AccountProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: false,
			openRemovalForm: false,
			isCurrentTab: false,
			isCurrentUser: false
		}
		this.findAndSyncUser = this.findAndSyncUser.bind(this);
		this.sendLike = this.sendLike.bind(this);
		this.removeLike = this.removeLike.bind(this);
		this.currentUserHasLikedVideo = this.currentUserHasLikedVideo.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleDeleteVideo = this.handleDeleteVideo.bind(this);
	}

	async componentDidMount(){
		if(!this.state.user){
			var userProfile = null;
			if(this.props.route.params){
				if(this.props.route.params.user){
					userProfile = this.props.route.params.user;
				}
			}
			var authenticatedUser = await AsyncStorage.getItem('@user');
			authenticatedUser = JSON.parse(authenticatedUser);
			if(userProfile._id == authenticatedUser._id){
				this.findAndSyncUser(userProfile, authenticatedUser);
			} else if(userProfile){
				this.setState({ user: userProfile });
			} else {
				this.props.navigation.navigate('Login');
			}
		}
	}

	async componentDidUpdate(){
		if(!this.state.user){
			var userProfile = null;
			if(this.props.route.params){
				if(this.props.route.params.user){
					userProfile = this.props.route.params.user;
				}
			}
			var authenticatedUser = await AsyncStorage.getItem('@user');
			authenticatedUser = JSON.parse(authenticatedUser);
			if(userProfile._id == authenticatedUser._id){
				this.findAndSyncUser(userProfile, authenticatedUser);
			} else if(userProfile){
				this.setState({ user: userProfile });
			} else {
				this.props.navigation.navigate('Login');
			}
		}
	}

	findAndSyncUser(userProfile, authenticatedUser){
		if(userProfile && authenticatedUser){
			// Check if user has liked their own video
			if(userProfile.uploadedVideos && authenticatedUser.likedVideos){
				userProfile.uploadedVideos.forEach((video) => {
					video.likedByCurrentUser = this.currentUserHasLikedVideo(video, authenticatedUser);
				});
			}
			// Check if user has liked their own video
			if(userProfile.likedVideos && authenticatedUser.likedVideos){
				userProfile.likedVideos.forEach((video) => {
					video.likedByCurrentUser = this.currentUserHasLikedVideo(video, authenticatedUser);
				});
			}
		}
		const isCurrentUser = userProfile._id == authenticatedUser._id;
		this.setState({
			user: userProfile,
			isCurrentUser
		});
	}

	async sendLike(video, videoList, videoListType){
		// const newLikedVideo = await fetch(`${process.env.APP_SERVER_URL}/sendLike/${video._id}`)
		const newLikedVideo = await fetch(`${process.env.APP_SERVER_URL}/sendLike/${video._id}`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				user: this.state.user || null
			})
		}).then(res => res.json())
		  .catch(error => console.log(error));
		if(newLikedVideo.message){
			// Display error message if included in response
			alert(newLikedVideo.message);
		} else if(newLikedVideo) {
			// Update the video state to be liked by the current user.
			newLikedVideo.likedByCurrentUser = true;
			let updatedUser = this.state.user;
			videoList[videoList.indexOf(video)] = newLikedVideo;
			updatedUser[videoListType] = videoList;
			// Check if re-sending like from liked videos so duplicate does not show
			let videoAlreadyLiked = false;
			updatedUser.likedVideos.forEach((userLikedVideo) => {
				if(String(video._id) == String(userLikedVideo._id)){
					videoAlreadyLiked = true;
					// Restore like to liked video
					updatedUser.likedVideos[updatedUser.likedVideos.indexOf(userLikedVideo)] = newLikedVideo;
				}
			});
			if(!videoAlreadyLiked && this.state.isCurrentUser){
				// If user likes their own video, add to liked videos
				updatedUser.likedVideos.push(newLikedVideo);
			}
			// Update uploaded video likes if restoring like from one in liked videos
			updatedUser.uploadedVideos.forEach((userLikedVideo) => {
				if(String(video._id) == String(userLikedVideo._id)){
					videoAlreadyLiked = true;
					// Restore like to liked video
					updatedUser.uploadedVideos[updatedUser.uploadedVideos.indexOf(userLikedVideo)] = newLikedVideo;
				}
			});
			this.setState({
				user: updatedUser
			});
		}
	}

	async removeLike(video, videoList, videoListType){
		const newUnlikedVideo = await fetch(`${process.env.APP_SERVER_URL}/removeLike/${video._id}`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				user: this.state.user || null
			})
		}).then(res => res.json())
		  .catch(error => console.log(error));
		if(newUnlikedVideo.message){
			// Display error message if included in response
			alert(newUnlikedVideo.message);
		} else if(newUnlikedVideo) {
			// Update the video state to remove like from the current user. Used immediately after unliking.
			newUnlikedVideo.likedByCurrentUser = false;
			let updatedUser = this.state.user;
			videoList[videoList.indexOf(video)] = newUnlikedVideo;
			updatedUser[videoListType] = videoList;
			// Update uploaded video likes if removing like from one in liked videos
			updatedUser.uploadedVideos.forEach((userUploadedVideo) => {
				if(String(video._id) == String(userUploadedVideo._id)){
					updatedUser.uploadedVideos[updatedUser.uploadedVideos.indexOf(userUploadedVideo)] = newUnlikedVideo;
				}
			});
			// Update liked video likes if removing like from one in uploaded videos
			updatedUser.likedVideos.forEach((userLikedVideo) => {
				if(String(video._id) == String(userLikedVideo._id)){
					updatedUser.likedVideos[updatedUser.likedVideos.indexOf(userLikedVideo)] = newUnlikedVideo;
				}
			});
			this.setState({
				user: updatedUser
			});
		}
	}

	currentUserHasLikedVideo(video, user){
		let liked = false;
		user.likedVideos.forEach((userLikedVideo) => {
			if(userLikedVideo._id === video._id){
				liked = true;
			}
		});
		return liked;
	}

	async handleLogout(){
	    await AsyncStorage.removeItem('@user');
		this.setState({
			user: false,
			isCurrentUser: false
		});
		this.props.navigation.navigate('Login');
	}

	handleDeleteVideo(event){
		if(this.state.openRemovalForm){
			this.state.openRemovalForm.submit();
		}
		this.setState({
			openRemovalForm: event.target.parentElement
		})
	}

	renderMedia(topic){
		if(topic.FeaturedImage){
			switch(topic.FeaturedImage.mime){
				case 'image/jpeg':
					return (
						<View style={Styles.fullWidth}>
							<Image source={{uri: `${process.env.STRAPI_URL}${topic.FeaturedImage.url}`}}
								style={{height: 225, width: 260, borderRadius: 25}}
							/>
						</View>
					);
				default:
					return <Text>Invalid media</Text>
			}
		}
	}

	render(){

		// document.addEventListener('cssmodal:hide', () => {
		// 	this.setState({
		// 		openRemovalForm: false
		// 	});
		// });

		var apiBaseURL = process.env.APP_SERVER_URL;

		return (
			<ScrollView>
				{this.state.user ?
					<View style={Styles.pad}>
						{this.state.isCurrentUser ?
							<View style={{...Styles.flex, ...Styles.xSpaceBetween}}>
								<Text style={Styles.heading}>Welcome, {this.state.user.firstName}!</Text>
								<Button icon="logout" onPress={this.handleLogout}>
									Logout
								</Button>
							</View>
							:
							<Text style={Styles.heading}>{this.state.user.firstName}</Text>
						}
						{this.state.user.completedTopics.length ?
							<View className="topics">
								<Headline>Completed Topics</Headline>
					    		<ScrollView horizontal>
									{this.state.user.completedTopics.map((topic) => 
					    				<View key={topic.id}>
						    				<View style={Styles.pad}>
						    					<Button icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
													this.props.navigation.navigate('Topic', {levelID: topic.levelID, topicID: topic.id})
												}>{topic.Topic}</Button>
						    					{this.renderMedia(topic)}
					    					</View>
				    					</View>
									)}
								</ScrollView>
							</View>
							:
							<View>
								<Headline>No Completed Topics</Headline>
							</View>
						}
						{/*this.state.isCurrentUser ?
							<View className="modal--show" id="remove-video" tabIndex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">
								<View className="modal-inner">
									<header id="modal-label">
										<Text>Remove Video</Text>
									</header>
									<View className="modal-content">
										Are you sure you want to remove this video?
									</View>
									<footer className="flex x-space-around">
										<a className="Button" href="#remove-video" onPress={this.handleDeleteVideo}>
											Remove Video
											<FontAwesomeIcon icon={faTrash}/>
										</Button>
										<Button href="#!" className="Button">
											Close
											<FontAwesomeIcon icon={faTimes}/>
										</Button>
									</footer>
								</View>
								<Button href="#!" className="modal-close" title="Close this modal" data-close="Close" data-dismiss="modal">?</Button>
							</View>
							:
							<Text></Text>
						*/}
						{this.state.user.uploadedVideos.length ?
							<View>
								<Headline>Uploaded Videos</Headline>
					    		<ScrollView horizontal>
									{this.state.user.uploadedVideos.map((video) => 
							    		<View key={video._id} style={{width: 300}}>
								    		<View style={{...Styles.pad}}>
												<View style={{ ...Styles.flex, ...Styles.xSpaceBetween }}>
													<View>
														<Text style={Styles.subHeading}>{video.title}</Text>
													</View>
													{this.state.isCurrentUser ?
														<Button icon="trash-can" onPress={this.handleDeleteVideo}>
															Remove Video
														</Button>
														:
														<Text></Text>
													}
												</View>
												<Video
													posterSource={{uri: video.thumbnailSrc ? apiBaseURL + '/' + video.thumbnailSrc : apiBaseURL + '/images/videoPlaceholder.png'}}
													ref={(ref) => {
														if(ref){
															ref.loadAsync({uri: apiBaseURL + '/' + video.src})
																.then(() => {
																	ref.setState({
																		showPoster: false
																	});
																});
														}
													}}
													style={{height: 225, width: '100%', borderRadius: 25, overflow: 'hidden'}}
													usePoster={true}
													useNativeControls={true}
													// overrideFileExtensionAndroid="mp4"
												/>
											</View>
											<View style={{ ...Styles.flex, ...Styles.xSpaceAround, ...Styles.yCenter }}>
												<Text>Likes: {video.likes || 0}</Text>
												{video.likedByCurrentUser ?
													<Button icon="star" onPress={() => this.removeLike(video, this.state.user.uploadedVideos, 'uploadedVideos')}>
														Liked
													</Button>
													:
													<Button icon="star-outline" onPress={() => this.sendLike(video, this.state.user.uploadedVideos, 'uploadedVideos')}>
														Like
													</Button>
												}
											</View>
										</View>
									)}
								</ScrollView>
							</View>
							:
							<View>
								<Headline>No Uploaded Videos</Headline>
							</View>
						}
						{this.state.user.likedVideos.length ?
							<View>
								<Headline>Liked Videos</Headline>
					    		<ScrollView horizontal>
									{this.state.user.likedVideos.map((video) => 
							    		<View key={video._id} style={{width: 300}}>
								    		<View style={{...Styles.pad}}>
												<View style={{ ...Styles.flex, ...Styles.xSpaceBetween }}>
													<View>
														<Text style={Styles.subHeading}>{video.title}</Text>
													</View>
												</View>
												<Video
													posterSource={{uri: video.thumbnailSrc ? apiBaseURL + '/' + video.thumbnailSrc : apiBaseURL + '/images/videoPlaceholder.png'}}
													ref={(ref) => {
														if(ref){
															ref.loadAsync({uri: apiBaseURL + '/' + video.src})
																.then(() => {
																	ref.setState({
																		showPoster: false
																	});
																});
														}
													}}
													style={{height: 225, width: '100%', borderRadius: 25, overflow: 'hidden'}}
													usePoster={true}
													useNativeControls={true}
													// overrideFileExtensionAndroid="mp4"
												/>
											</View>
											<View style={{ ...Styles.flex, ...Styles.xSpaceAround, ...Styles.yCenter }}>
												<Text>Likes: {video.likes || 0}</Text>
												{video.likedByCurrentUser ?
													<Button icon="star" onPress={() => this.removeLike(video, this.state.user.likedVideos, 'likedVideos')}>
														Liked
													</Button>
													:
													<Button icon="star-outline" onPress={() => this.sendLike(video, this.state.user.likedVideos, 'likedVideos')}>
														Like
													</Button>
												}
											</View>
										</View>
									)}
								</ScrollView>
							</View>
							:
							<View>
								<Headline>No Liked Videos</Headline>
							</View>
						}
					</View>
					:
					<View style={Styles.pad}>
						<Button icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
							this.props.navigation.navigate('Login')
						}>Login</Button>
					</View>
				}
			</ScrollView>
		);
	}
}

export default AccountProfile;