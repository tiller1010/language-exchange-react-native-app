import React from 'react';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { parse as URLParse } from 'search-params';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';

async function getVideos(url=`${process.env.APP_SERVER_URL}/videos.json`){

	var searchKeywords = '';
	var page = '1';

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
			keywords: '',
			sortControlStatus: '',
			sort: ''
		}
		this.pagination = this.pagination.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
	}

	async componentDidMount(){
		if(this.props.route.params){
			if(this.props.route.params.keywords || this.props.route.params.sort){
				console.log('Fetching from:', process.env.APP_SERVER_URL);
				if(this.props.route.params.keywords){
					this.setState({
						keywords: this.props.route.params.keywords
					}, () => {
						this.handleSearch(`${process.env.APP_SERVER_URL}/videos.json?keywords=${this.state.keywords}&sort=${this.state.sort}`);
					});
				}
				if(this.props.route.params.sort){
					this.setState({
						sort: this.props.route.params.sort
					}, () => {
						this.handleSearch(`${process.env.APP_SERVER_URL}/videos.json?keywords=${this.state.keywords}&sort=${this.state.sort}`);
					});
				}
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
			this.handleSearch(`${process.env.APP_SERVER_URL}/videos.json?keywords=${this.state.keywords}&sort=${this.state.sort}`);
		});
	}

	pagination(pages){
		var pageLinks = [];
		for(var i = 1; i <= pages; i++){
			pageLinks.push({pageNumber: i});
		}
		return pageLinks;
	}

	render(){

		var apiBaseURL = process.env.APP_SERVER_URL;
		var keywords = this.state.keywords;

		return (
			<ScrollView>		
				<View style={Styles.pad}>	
					<Text style={Styles.heading}>Videos</Text>
					<Button icon="refresh" onPress={
						() => {
							this.setState({keywords: ''});
							this.handleChangePage(`${apiBaseURL}/videos.json?page=${this.state.currentPage}`);
						}
					}/>
					<Text style={Styles.subHeading}>Search Terms</Text>
					<Searchbar type="text" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
						style={{
							borderWidth: 1,
							borderColor: 'black'
						}}
					/>
					<View style={{...Styles.flex, ...Styles.xCenter}}>
						<View style={Styles.pad}>
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
						<View style={Styles.pad}>
							<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={() =>
								this.handleSearch(`${apiBaseURL}/videos.json?keywords=${this.state.keywords}`)
							}>Search</Button>
						</View>
					</View>
				    <View>
					    <TextButton title="Clear filters" onPress={
							() => {
								this.setState({keywords: ''});
								this.handleChangePage(`${apiBaseURL}/videos.json`);
							}
					    }/>
				    </View>
				    <View>
					    <TextButton title="Add a video" onPress={() => 
					    	this.props.navigation.navigate('VideosAdd')
					    }/>
				    </View>
			    </View>
				<View>
					{this.state.pages.length ?
						<ScrollView horizontal>
							{this.state.currentPage > 1 ?
								<View>
									<Button mode="outlined" icon="arrow-left" onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`)}>
										Prev
									</Button>
								</View>
								:
								<Text></Text>
							}
							{this.state.pages.map((page) =>
								<View key={this.state.pages.indexOf(page)}>
									<Button mode={this.state.pages.indexOf(page) + 1 == this.state.currentPage ? 'contained' : 'outlined'}
										onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`)}>
										{page.pageNumber}
									</Button>
								</View>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<View>
									<Button mode="outlined" icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}} onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`)}>
										Next
									</Button>
								</View>
								:
								<Text></Text>
							}
						</ScrollView>
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
						<ScrollView horizontal>
							{this.state.currentPage > 1 ?
								<View>
									<Button mode="outlined" icon="arrow-left" onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`)}>
										Prev
									</Button>
								</View>
								:
								<Text></Text>
							}
							{this.state.pages.map((page) =>
								<View key={this.state.pages.indexOf(page)}>
									<Button mode={this.state.pages.indexOf(page) + 1 == this.state.currentPage ? 'contained' : 'outlined'}
										onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`)}>
										{page.pageNumber}
									</Button>
								</View>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<View>
									<Button mode="outlined" icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}} onPress={() => this.handleChangePage(`${apiBaseURL}/videos.json?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`)}>
										Next
									</Button>
								</View>
								:
								<Text></Text>
							}
						</ScrollView>
						:
						<Text></Text>
					}
				</View>
			</ScrollView>
		);
	}
}

export default VideosIndex;