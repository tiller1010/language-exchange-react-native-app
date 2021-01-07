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

	render(){
		return (
			<ScrollView>
			    {this.state.topics ?
			    	this.state.topics.map((topic) => 
			    		<View key={topic.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>			    		
	    					<Button title={topic.Topic} onPress={() =>
								this.props.navigation.navigate('Topic', {levelID: this.state.levelID, topicID: topic.id})
							}/>
				    		{topic.challenges ?
			    				<View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
					    			{topic.challenges.map((challenge) =>
					    				<View key={`${topic.id}_${challenge.id}`} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
						    				<View>
							    				<Text>{challenge.Title}</Text>
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