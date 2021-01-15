import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import Styles from './Styles.js';

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
			axios.get(`http://192.168.1.5:1337/levels/${this.props.route.params.levelID}`)
				.then(res => {
					this.setState({
						topics: res.data.topics,
						levelID: this.props.route.params.levelID
					});
				})
			}
		}

		axios.get(`http://192.168.1.5:1337/challenges`)
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
							<Image source={{uri: `http://192.168.1.5:1337${topic.FeaturedImage.url}`}}
								style={{height: 400, width: '100%'}}
							/>
						</View>
					);
				default:
					return <Text>Invalid media</Text>
			}
		}
	}

	render(){
		return (
			<ScrollView>
			    {this.state.topics ?
			    	this.state.topics.map((topic) => 
			    		<View key={topic.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>			    		
	    					<Button title={topic.Topic} onPress={() =>
								this.props.navigation.navigate('Topic', {levelID: this.state.levelID, topicID: topic.id})
							}/>
							{this.renderMedia(topic)}
				    		{topic.challenges ?
			    				<View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
					    			{topic.challenges.map((challenge) =>
					    				<View key={`${topic.id}_${challenge.id}`} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
						    				<View style={Styles.pad}>
							    				<Text style={Styles.heading}>{challenge.Title}</Text>
						    					<Text>{challenge.Content}</Text>
					    					</View>
				    					</View>
				    				)}
			    				</View>
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