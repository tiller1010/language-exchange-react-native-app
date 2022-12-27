import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Button as TextButton, Image, ScrollView } from 'react-native';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import TopicLink from './TopicLink.jsx';

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

				const newState = {
					levelID: this.props.route.params.levelID,
				};
				this.setState(newState, () => {
					axios.get(`${process.env.STRAPI_URL}/levels/${this.props.route.params.levelID}?populate[topics][populate][0]=FeaturedMedia%2Cchallenges`)
						.then(res => {
							const data = res.data;
							const level = data.data;
							const topics = level.attributes.topics.data;
							this.setState({
								topics,
								loaded: true,
							});
						})
				})
			}
		}
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
		return topic.attributes.challenges.data.sort(() => .5 - Math.random()).slice(0, 5);
	}

	render(){
		return (
			<ScrollView>
				{this.state.topics ?
					this.state.topics.map((topic) => 
						<View key={topic.id}>
							<View style={{ ...Styles.pad, width: 400 }}>
								<View style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
									<TopicLink topic={topic} levelID={topic.levelID} navigation={this.props.navigation}/>
									{topic.attributes.challenges.data ?
										<ScrollView horizontal>
											<View style={{...Styles.pad, width: 400}}>
												<Text style={{...Styles.subHeading, textAlign: 'center'}}>Need a quick refresher? Slide forward to preview challenges.</Text>
											</View>
											{this.randomChallenges(topic).map((challenge) =>
												<View key={`${topic.id}_${challenge.id}`} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
													<View style={Styles.pad}>
														<Text style={Styles.heading}>{challenge.attributes.Title}</Text>
														<Text>{challenge.attributes.Content}</Text>
													</View>
												</View>
											)}
										</ScrollView>
										:
										<Text>No challenges</Text>
									}
								</View>
							</View>
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