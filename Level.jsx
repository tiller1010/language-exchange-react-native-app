import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Button as TextButton, Image, ScrollView } from 'react-native';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';

class Level extends React.Component {
	constructor(){
		super();
		this.state = {
			topics: [],
			levelID: ''
		}
	}

	async componentDidMount(){
		if(this.props.route.params){
			if(this.props.route.params.levelID){
			console.log('Fetching from:', process.env.STRAPI_URL);
			axios.get(`${process.env.STRAPI_URL}/levels/${this.props.route.params.levelID}`)
				.then(res => {
					this.setState({
						topics: res.data.topics,
						levelID: this.props.route.params.levelID
					});
				})
			}
		}

		axios.get(`${process.env.STRAPI_URL}/challenges`)
			.then(res => {
				if(res.data){
					res.data.forEach((challenge) => {
						if(challenge.topic){
							var topics = this.state.topics;
							topics.forEach((topic) => {
								if(topic.id === challenge.topic.id){
									topic.challenges = topic.challenges ? topic.challenges.concat(challenge) : [ challenge ];
									this.setState({
										topics
									});
								}
							});
						}
					})
				}
			})
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

	randomChallenges(topic){
		return topic.challenges.sort(() => .5 - Math.random()).slice(0, 5);
	}

	render(){
		return (
			<ScrollView>
			    {this.state.topics ?
			    	this.state.topics.map((topic) => 
			    		<View key={topic.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>			    		
	    					<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
								this.props.navigation.navigate('Topic', {levelID: this.state.levelID, topicID: topic.id})
							}>{topic.Topic}</Button>
							{this.renderMedia(topic)}
				    		{topic.challenges ?
								<ScrollView horizontal>
						    		<View style={{...Styles.pad, width: 400}}>
					    				<Text style={{...Styles.subHeading, textAlign: 'center'}}>Need a quick refresher? Slide forward to preview challenges.</Text>
				    				</View>
					    			{this.randomChallenges(topic).map((challenge) =>
					    				<View key={`${topic.id}_${challenge.id}`} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
						    				<View style={Styles.pad}>
							    				<Text style={Styles.heading}>{challenge.Title}</Text>
						    					<Text>{challenge.Content}</Text>
					    					</View>
				    					</View>
				    				)}
								</ScrollView>
			    				:
			    				<Text>No challenges</Text>
				    		}
			    		</View>
		    		) 
			    	:
			    	<Text>No topics</Text>
			    }
			</ScrollView>
		);
	}
}

export default Level;