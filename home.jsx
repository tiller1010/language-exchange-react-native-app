import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';

class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: '',
			keywords: '',
			sort: '',
			sortControlStatus: '',
			recentVideos: []
		}
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
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

	toggleSortControls(){
		let newStatus = this.state.sortControlStatus ? '' : 'visible';
		this.setState({
			sortControlStatus: newStatus
		});
	}

	handleSortChange(value){
		this.setState({
			sort: value,
			sortControlStatus: ''
		}, () => {
			this.props.navigation.navigate('VideosIndex', {sort: this.state.sort, keywords: this.state.keywords || ''});
		});
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
						<Searchbar type="text" placeholder="Search video submissions" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
							style={{
								borderWidth: 1,
								borderColor: 'black'
							}}
						/>
						<View style={{...Styles.flex, ...Styles.xCenter}}>
							<View style={Styles.halfPad}>
								<Menu
									anchor={<Button onPress={this.toggleSortControls} icon="tune" mode="contained" labelStyle={{color: 'white'}}>Search & Sort</Button>}
									visible={this.state.sortControlStatus}
								>
									<RadioButton.Group>
										<RadioButton.Item label="All" name="sort" value="" status={this.state.sort === '' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('')}/>
										<RadioButton.Item label="Oldest" name="sort" value="Oldest" status={this.state.sort === 'Oldest' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Oldest')}/>
										<RadioButton.Item label="Recent" name="sort" value="Recent" status={this.state.sort === 'Recent' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Recent')}/>
										<RadioButton.Item label="A-Z" name="sort" value="A-Z" status={this.state.sort === 'A-Z' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('A-Z')}/>
										<RadioButton.Item label="Z-A" name="sort" value="Z-A" status={this.state.sort === 'Z-A' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Z-A')}/>
									</RadioButton.Group>
									<Menu.Item icon="close" title="Close" onPress={this.toggleSortControls}/>
								</Menu>
							</View>
							<View style={Styles.halfPad}>
								<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={() =>
									this.props.navigation.navigate('VideosIndex', {keywords: this.state.keywords})
								}>Search Videos</Button>
							</View>
						</View>
					</View>
				</View>

				<ScrollView horizontal contentContainerStyle={{ width: 1500 }}>
			    	{this.state.recentVideos.map((video) => 
			    		<View key={video._id} style={{height: 300, width: 300}}>
				    		<View style={{...Styles.pad}}>
								<Text style={Styles.subHeading}>{video.title}</Text>
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
									style={{height: 225, width: '100%', borderRadius: 25, overflow: 'hidden'}}
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
				    		<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
									this.props.navigation.navigate('Level', {levelID: level.id})
								}
							>{`Level ${level.Level}`}</Button>
				    		{level.topics ?
				    			<View style={Styles.fullWidth}>
					    			{this.randomTopics(level).map((topic) =>
				    					<View key={topic.id} style={Styles.fullWidth}>
						    					<Button icon="arrow-right" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
													this.props.navigation.navigate('Topic', {levelID: level.id, topicID: topic.id})
												}>{topic.Topic}</Button>
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