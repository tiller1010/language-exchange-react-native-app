import React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';

import graphQLFetch from './graphQLFetch.js';
import MediaRenderer from './MediaRenderer.jsx';

export default class VideoPlayer extends React.Component {
	constructor(props){
		super(props);
		let state = {
			likes: 0,
			likedByCurrentUser: false
		}
		this.state = state;
		this.toggleLike = this.toggleLike.bind(this);
		this.handleUserProfileNavigation = this.handleUserProfileNavigation.bind(this);
	}

	componentDidMount(){
		const { likes, likedByCurrentUser } = this.props;
		this.setState({
			likes,
			likedByCurrentUser
		});
	}

	componentDidUpdate(prevProps){
		if(this.props.likedByCurrentUser != prevProps.likedByCurrentUser){
			this.setState({
				likedByCurrentUser: this.props.likedByCurrentUser
			});
		}
		if(this.props.likes != prevProps.likes){
			this.setState({
				likes: this.props.likes
			});
		}
	}

	async toggleLike(videoID){
		if(!this.props.authenticatedUserID){
			alert('Must be signed in to send like.');
			return;
		}
		const apiSegment = this.state.likedByCurrentUser ? 'removeLike' : 'addLike';
		const query = `mutation addLike($userID: ID!, $videoID: ID!){
			${apiSegment}(userID: $userID, videoID: $videoID){
				_id
				title
 				languageOfTopic
				src
				originalName
				thumbnailSrc
				originalThumbnailName
				created
				likes
				uploadedBy {
					_id
					displayName
				}
			}
		}`;
		const data = await graphQLFetch(query, {
			userID: this.props.authenticatedUserID,
			videoID: videoID
		});
		const newVideo = data[apiSegment];

		if(newVideo.message){
			// Display error message if included in response
			alert(newVideo.message);
		}

		this.setState(prevState => ({
			likes: newVideo.likes,
			likedByCurrentUser: !prevState.likedByCurrentUser
		}));

		if(this.props.afterToggleLike){
			this.props.afterToggleLike(newVideo, this.state.likedByCurrentUser);
		}
	}

	async handleUserProfileNavigation(userID){
		let user = await fetch(`${process.env.APP_SERVER_URL}/user/${userID}`)
			.then((response) => response.json())
			.catch((e) => console.log(e));
		this.props.navigation.navigate('Account Profile', { user });
	}

	render(){

		const { likes, likedByCurrentUser } = this.state;
		const { _id, title, languageOfTopic, uploadedBy, src, thumbnailSrc } = this.props;

		return (
			<View style={{ position: 'relative' }}>
				<View className="flex x-center">
					<View className="desktop-100" style={{ maxWidth: '400px' }}>
						<View className="flex x-space-between y-center" style={{ flexWrap: 'nowrap' }}>
							<View style={{ maxWidth: '65%' }}>
								<View>
									<Text>{title}</Text>
									{languageOfTopic ?
										<Text>{languageOfTopic}</Text>
										:
										''
									}
								</View>
							</View>
							{this.props.handleDeleteVideo ?
								<>
								<View>
									Delete
								</View>
								<View>
									Edit
								</View>
								</>
								:
								''
							}
							{uploadedBy._id ?
								<View>
									<TextButton title={`By: ${uploadedBy.displayName}`} onPress={() => this.handleUserProfileNavigation(uploadedBy._id)}/>
								</View>
								:
								<View>
									<Text>By: {uploadedBy.displayName}</Text>
								</View>
							}
						</View>
						<MediaRenderer src={src} thumbnailSrc={thumbnailSrc}/>
					</View>
				</View>
				<View className="flex x-space-around y-center">
					<Text>Likes: {likes || 0}</Text>
						<Button icon={likedByCurrentUser ? 'star' : 'star-outline'} className="button" onPress={() => this.toggleLike(_id)}>
						{likedByCurrentUser ?
							<Text>
								Liked
							</Text>
							:
							<Text>
								Like
							</Text>
						}
						</Button>
				</View>
			</View>
		);
	}
}