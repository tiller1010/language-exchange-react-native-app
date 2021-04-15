import React from 'react';
import axios from 'axios';
import { Text, View, Button as TextButton, Image, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
										}, async () => {
											// Check if current user has completed this topic
											var authenticatedUser = await AsyncStorage.getItem('@user');
											if(authenticatedUser){
												authenticatedUser = JSON.parse(authenticatedUser);
											} else {
												authenticatedUser = { completedTopics: [] };
											}
											let completed = false;
											authenticatedUser.completedTopics.forEach((topic) => {
												if(topic.id == this.props.route.params.topicID){
													completed = true;
												}
											});
											if(completed){
												let completedChalleges = [];
												this.state.challenges.forEach((stateChallenge) => {
													stateChallenge.answered = 'correct';
													completedChalleges.push(stateChallenge);
												});
												this.setState({
													challenges: completedChalleges,
													allChallengesAnswered: true
												});
											}
										});
									}
								}
							})
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
			    {this.state.challenges ?
			    	<ScrollView horizontal>
				    	{shuffleArray(this.state.challenges).map((challenge) => 
				    		<View key={this.state.challenges.indexOf(challenge)}>
					    		<View style={Styles.pad}>
					    			<View>
						    			<Button icon={challenge.answered ? 'check-circle' : ''} labelStyle={challenge.answered ? {color: 'green'} : {}}>
							    			{challenge.Title}
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
							    			<Text>{challenge.Content}</Text>
						    			</View>
					    			</View>
					    			{challenge.FeaturedMedia.length ?
					    				this.renderMedia(challenge)
					    				:
					    				<Text></Text>
					    			}
					    			<View style={{...Styles.flex, ...Styles.xCenter}}>
						    			<View style={Styles.halfPad}>
											<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={() => 
										    	this.props.navigation.navigate('Videos', {keywords: challenge.Title})
										    }>View others</Button>
							    		</View>
						    			<View style={Styles.halfPad}>
											<Button icon="plus" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={() => 
										    	this.props.navigation.navigate('Add Video', {challenge: challenge.Title})
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