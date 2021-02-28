import React from 'react';
import axios from 'axios';
import { Text, View, Button as TextButton, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, TextInput } from 'react-native-paper';

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
				console.log('Fetching from:', process.env.STRAPI_URL);
				axios.get(`${process.env.STRAPI_URL}/topics/${this.props.route.params.topicID}`)
					.then(res => {
						if(res.data){
							this.setState({
								topic: res.data.Topic
							})
						}
					})

				axios.get(`${process.env.STRAPI_URL}/challenges`)
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
								<Image source={{uri: `${process.env.STRAPI_URL}${challenge.FeaturedMedia[0].url}`}}
									style={{height: 400, width: '100%'}}
								/>
							</View>
						);
					case 'video/mp4':
						return (
							<Video
								source={{uri: `${process.env.STRAPI_URL}${challenge.FeaturedMedia[0].url}`}}
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
				<View style={Styles.pad}>
					<Text style={Styles.heading}>{this.state.topic}</Text>
				</View>
			    {this.state.challenges ?
			    	<View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
				    	{this.state.challenges.map((challenge) => 
				    		<View key={challenge.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
					    		<View>
						    		<View style={Styles.pad}>
						    			<Text style={Styles.subHeading}>{challenge.Title}</Text>
						    			<Text>{challenge.Content}</Text>
					    			</View>
					    			{challenge.FeaturedMedia.length ?
					    				this.renderMedia(challenge)
					    				:
					    				<Text></Text>
					    			}
					    			<View style={{...Styles.flex, ...Styles.xCenter}}>
						    			<View style={Styles.halfPad}>
											<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={() => 
										    	this.props.navigation.navigate('VideosIndex', {keywords: challenge.Title})
										    }>View others</Button>
							    		</View>
						    			<View style={Styles.halfPad}>
											<Button icon="plus" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={() => 
										    	this.props.navigation.navigate('VideosAdd', {challenge: challenge.Title})
										    }>Submit your own</Button>
							    		</View>
						    		</View>
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