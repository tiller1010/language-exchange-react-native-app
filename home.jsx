import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import Styles from './Styles.js';

class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			keywords: ''
		}
	}

	async componentDidMount(){
		console.log('Fetching from:', process.env.STRAPI_URL);
		axios.get(`${process.env.STRAPI_URL}/levels`)
			.then(res => {
				this.setState({
					levels: res.data
				});
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

	randomTopics(level){
		if(level.topicsRandomized){
			return level.topics;
		} else {
			level.topicsRandomized = true;
			level.topics = level.topics.sort(() => .5 - Math.random()).slice(0, 5);
			return level.topics;
		}
	}

	render(){
		return(
			<ScrollView>
				<Text style={Styles.heading}>Video Submissions</Text>
				<View>
					<Text style={Styles.subHeading}>Search Terms</Text>
					<TextInput type="text" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
						style={{
							borderWidth: 1,
							borderColor: 'black'
						}}
					/>
					<Button title="Search"  onPress={() =>
						this.props.navigation.navigate('VideosIndex', {keywords: this.state.keywords})
					}/>
				</View>
			    <Button title="View all videos" onPress={() =>
					this.props.navigation.navigate('VideosIndex')
				}/>

			    {this.state.levels ?
			    	this.state.levels.map((level) => 
			    		<View key={level.id} style={{...Styles.flex, ...Styles.column, ...Styles.fullWidth, ...Styles.xCenter}}>
				    		<Button title={`Level: ${level.Level}`} onPress={() =>
									this.props.navigation.navigate('Level', {levelID: level.id})
								}
							/>
				    		{level.topics ?
				    			<View style={Styles.fullWidth}>
					    			{this.randomTopics(level).map((topic) =>
				    					<View key={topic.id} style={Styles.fullWidth}>
						    					<Button title={topic.Topic} onPress={() =>
													this.props.navigation.navigate('Topic', {levelID: level.id, topicID: topic.id})
												}/>
						    					{this.renderMedia(topic)}
				    					</View>
				    				)}
			    				</View>
			    				:
			    				<Text>No topics</Text>
				    		}
			    		</View>
		    		) 
			    	:
			    	<Text>No levels</Text>
			    }
			</ScrollView>
		);
	}
}

export default Home;