import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';

class Topic extends React.Component {
	constructor(){
		super();
		this.state = {
			challenges: []
		}
	}

	async componentDidMount(){
		if(this.props.route.params){
			if(this.props.route.params.topicID){
				axios.get(`http://192.168.1.5:1337/topics/${this.props.route.params.topicID}`)
					.then(res => {
						if(res.data){
							this.setState({
								topic: res.data.Topic
							})
						}
					})

				axios.get(`http://192.168.1.5:1337/challenges`)
					.then(res => {
						if(res.data){
							res.data.forEach((challenge) => {
								if(challenge.topic){
									var challenges = this.state.challenges;
									if(this.props.route.params.topicID == challenge.topic.id){
										challenges = challenges.concat(challenge);
										this.setState({
											challenges
										});
									}
								}
							})
						}
					})
			}
		}

	}

	renderMedia(challenge){
		if(challenge.FeaturedMedia){
			if(challenge.FeaturedMedia.length){
				switch(challenge.FeaturedMedia[0].mime){
					case 'image/jpeg':
						return (
							<View style={Styles.fullWidth}>
								<Image source={{uri: `http://192.168.1.5:1337${challenge.FeaturedMedia[0].url}`}}
									style={{height: 400, width: '100%'}}
								/>
							</View>
						);
					case 'video/mp4':
						return (
							<Video
								source={{uri: `http://192.168.1.5:1337${challenge.FeaturedMedia[0].url}`}}
								ref={(ref) => {
									this.player = ref
								}}
								style={{height: 225, width: '100%'}}
								// usePoster={true}
								useNativeControls={true}
								// overrideFileExtensionAndroid="mp4"
							/>
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
				<Text>{this.state.topic}</Text>
			    {this.state.challenges ?
			    	<View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
				    	{this.state.challenges.map((challenge) => 
				    		<View key={challenge.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
					    		<View>
					    			<Text>{challenge.Title}</Text>
					    			<Text>{challenge.Content}</Text>
					    			{challenge.FeaturedMedia.length ?
					    				this.renderMedia(challenge)
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