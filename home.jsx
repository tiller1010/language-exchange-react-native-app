import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';

class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			keywords: '',
			recentVideos: []
		}
	}

	async componentDidMount(){
		// Get recent videos
		console.log('Fetching from:', process.env.APP_SERVER_URL);
		axios.get(`${process.env.APP_SERVER_URL}/recent-videos`)
			.then(res => {
				console.log(res)
				this.setState({
					recentVideos: res.data.videos
				});
			});

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
		
		var apiBaseURL = process.env.APP_SERVER_URL;

		return(
			<ScrollView>
				<View style={Styles.pad}>
					<Text>Let's enjoy your</Text>
					<Text style={Styles.heading}>User Submissions</Text>
					<View>
						<Text style={Styles.subHeading}>Search video submissions</Text>
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
				</View>

				<ScrollView horizontal contentContainerStyle={{ width: 2000 }}>
			    	{this.state.recentVideos.map((video) => 
			    		<View key={video._id} style={{height: 300, width: 400}}>
				    		<View style={{...Styles.pad}}>
								<Text>{video.title}</Text>
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
									style={{height: 225, width: '100%'}}
									usePoster={true}
									useNativeControls={true}
									// overrideFileExtensionAndroid="mp4"
								/>
							</View>
						</View>
		    		)}
				</ScrollView>

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