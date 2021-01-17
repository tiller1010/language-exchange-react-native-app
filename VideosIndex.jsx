import React from 'react';
import { Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { parse as URLParse } from 'search-params';
import Styles from './Styles.js';

async function getVideos(url='http://192.168.1.5:3000/videos.json'){

	var searchKeywords = '';
	var page = '1';

	// Change this to use an env setting
	var apiBaseURL = 'http://192.168.1.5:3000';
	return fetch(url)
		.then((response) => response.json())
		.catch((e) => console.log(e));
}

class VideosIndex extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			videos: [],
			pages: [],
			currentPage: 1,
			keywords: ''
		}
		this.pagination = this.pagination.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	async componentDidMount(){
		if(this.props.route.params){
			if(this.props.route.params.keywords){
				this.setState({
					keywords: this.props.route.params.keywords
				});
				this.handleSearch(`http://192.168.1.5:3000/videos.json?keywords=${this.props.route.params.keywords}`);
				return;
			}
		}
		var page = 1;
		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
	}

	async handleChangePage(url){
		var page = URLParse(url).page ||  1;

		var newVideos = await getVideos(url);
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
	}

	async handleSearch(url){
		var page = 1;

		var newVideos = await getVideos(url);
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
	}

	pagination(pages){
		var pageLinks = [];
		for(var i = 1; i <= pages; i++){
			pageLinks.push({pageNumber: i});
		}
		return pageLinks;
	}

	render(){

		var apiBaseURL = 'http://192.168.1.5:3000';
		var keywords = this.state.keywords;

		return (
			<ScrollView>			
				<Text style={Styles.heading}>Videos</Text>
				<Button title="Refresh" onPress={
					() => {
						this.setState({keywords: ''});
						this.handleChangePage(`${apiBaseURL}/videos.json?page=${this.state.currentPage}`);
					}
				}/>
				<View>
					<Text style={Styles.subHeading}>Search Terms</Text>
					<TextInput type="text" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
						style={{
							borderWidth: 1,
							borderColor: 'black'
						}}
					/>
					<Button title="Search" onPress={() => this.handleSearch(`http://192.168.1.5:3000/videos.json?keywords=${this.state.keywords}`)}/>
				</View>
			    <View>
				    <Button title="Clear filters" onPress={
						() => {
							this.setState({keywords: ''});
							this.handleChangePage(`${apiBaseURL}/videos.json`);
						}
				    }/>
			    </View>
			    <View>
				    <Button title="Add a video" onPress={() => 
				    	this.props.navigation.navigate('VideosAdd')
				    }/>
			    </View>
				<View>
					{this.state.pages.length ?
						<View style={Styles.flex}>
							{this.state.currentPage > 1 ?
								<View>
									<Button title="Prev" onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`)}/>
								</View>
								:
								<Text></Text>
							}
							{this.state.pages.map((page) =>
								<View key={this.state.pages.indexOf(page)}>
									<Button title={`${page.pageNumber}`} onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`)}/>
								</View>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<View>
									<Button title="Next" onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`)}/>
								</View>
								:
								<Text></Text>
							}
						</View>
						:
						<Text></Text>
					}
					{this.state.videos.length ?
						<View>
							{this.state.videos.map((video) => 
								<View key={video._id}>
									<Text style={Styles.subHeading}>{video.title}</Text>
									{video.src ?
										<View>
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
										:
										<Text>No Video Source</Text>
									}
								</View>
							)}
						</View>
						:
						<Text>No videos</Text>
					}
					{this.state.pages.length ?
						<View style={Styles.flex}>
							{this.state.currentPage > 1 ?
								<View>
									<Button title="Prev" onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`)}/>
								</View>
								:
								<Text></Text>
							}
							{this.state.pages.map((page) =>
								<View key={this.state.pages.indexOf(page)}>
									<Button title={`${page.pageNumber}`} onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`)}/>
								</View>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<View>
									<Button title="Next" onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`)}/>
								</View>
								:
								<Text></Text>
							}
						</View>
						:
						<Text></Text>
					}
				</View>
			</ScrollView>
		);
	}
}

export default VideosIndex;