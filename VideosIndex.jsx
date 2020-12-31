import React from 'react';
// import lozad from 'lozad';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView, FlatList } from 'react-native';
import { Video } from 'expo-av';
import { parse as URLParse } from 'search-params';

async function getVideos(url='http://192.168.1.5:3000/videos.json'){
	// var urlParams = new URLSearchParams(window.location.search);
	// var searchKeywords = urlParams.get('keywords') || '';
	// var page = urlParams.get('page') || '';

	var searchKeywords = '';
	var page = '1';

	// Change this to use an env setting
	var apiBaseURL = 'http://192.168.1.5:3000';
	// return fetch(`${apiBaseURL}/videos.json?${searchKeywords ? 'keywords=' + searchKeywords + '&' : ''}${page ? 'page=' + page : ''}`)
	return fetch(url)
		.then((response) => response.json())
		.catch((e) => console.log(e));
}

// Enable lazy loading
// const lozadObserver = lozad();
// lozadObserver.observe();

const flex = {
	flex: 1,
	flexDirection: 'row'
}

class VideosIndex extends React.Component {
	constructor(){
		super();
		this.state = {
			videos: [],
			pages: [],
			currentPage: 1
		}
		this.refreshVideos = this.refreshVideos.bind(this);
		this.pagination = this.pagination.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	async componentDidMount(){
		// var urlParams = new URLSearchParams(window.location.search);
		// var page = urlParams.get('page') || 1;
		var page = 1;

		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
		// console.log('http://192.168.1.5:3000' + '/' + this.state.videos[0].src)
	}

	async refreshVideos(){
		// var urlParams = new URLSearchParams(window.location.search);
		// var page = urlParams.get('page') || 1;

		// var newVideos = await getVideos();
		// if(newVideos){
		// 	this.setState({
		// 		videos: newVideos.videos,
		// 		pages: this.pagination(newVideos.pages),
		// 		currentPage: page
		// 	});
		// }
	}

	async handleChangePage(url){
		// window.history.pushState({}, '', event.target.href);
		// this.refreshVideos();

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

	handleSearch(event){
		event.preventDefault();
		var url = event.target.action + '?' + (new URLSearchParams(new FormData(event.target)).toString());
		window.history.pushState({}, '', url);
		this.refreshVideos();
	}

	pagination(pages){
		var pageLinks = [];
		for(var i = 1; i <= pages; i++){
			pageLinks.push({pageNumber: i});
		}
		return pageLinks;
	}

	render(){

		// var urlParams = new URLSearchParams(window.location.search);
		// var keywords = urlParams.get('keywords') || null;

		var apiBaseURL = 'http://192.168.1.5:3000';
		var keywords = '';

		return (
			<ScrollView>			
				<Text>Videos</Text>
				<View>
					<Button title="Back" href={`/`}/>
				</View>
				<Button title="Refresh" onClick={this.refreshVideos}/>
				<View action="/videos" method="GET" onSubmit={this.handleSearch}>
					<Text htmlFor="keywords">Search Terms</Text>
					<TextInput type="text" name="keywords"/>
					<Button title="Search"/>
				</View>
			    <View>
				    <Button title="Clear filters" onClick={this.handleChangePage} href="/videos"/>
			    </View>
			    <View>
				    <Button title="Add a video" onPress={() => 
				    	this.props.navigation.navigate('VideosAdd')
				    }/>
			    </View>
				<View>
					{this.state.pages.length ?
						<View style={flex}>
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
									<Text>{video.title}</Text>
									{video.src ?
										<View>
											<Video
												source={{uri: apiBaseURL + '/' + video.src}}
												posterSource={{uri: video.thumbnailSrc ? apiBaseURL + '/' + video.thumbnailSrc : apiBaseURL + '/images/videoPlaceholder.png'}}
												ref={(ref) => {
													this.player = ref
												}}
												style={{height: 225, width: 400}}
												// usePoster={true}
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
						<View style={flex}>
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