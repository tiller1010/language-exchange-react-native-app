import React from 'react';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { parse as URLParse } from 'search-params';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import VideoComponent from './VideoComponent.jsx';
import ReadMore from '@kangyoosam/react-native-readmore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
			sort: '',
			userLikedVideos: []
		}
		this.pagination = this.pagination.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
		this.handleUserProfileNavigation = this.handleUserProfileNavigation.bind(this);
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

		var authenticatedUser = await AsyncStorage.getItem('@user');
		if(authenticatedUser){
			authenticatedUser = JSON.parse(authenticatedUser);
			this.setState({
				userLikedVideos: JSON.parse(authenticatedUser.userLikedVideos)
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

	async sendLike(video){
		const newLikedVideo = await fetch(`${process.env.APP_SERVER_URL}/sendLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newLikedVideo.message){
			// Display error message if included in response
			alert(newLikedVideo.message);
		} else if(newLikedVideo) {
			// Update the video state to be liked by the current user. Used immediately after liking.
			newLikedVideo.likedByCurrentUser = true;
			let newVideos = this.state.videos;
			newVideos[newVideos.indexOf(video)] = newLikedVideo;
			// Add video to user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = this.state.userLikedVideos;
			newUserLikedVideos.push(video);
			this.setState({
				videos: newVideos,
				userLikedVideos: newUserLikedVideos
			});
		}
	}

	async removeLike(video){
		const newUnlikedVideo = await fetch(`${document.location.origin}/removeLike/${video._id}`)
			.then(res => res.json())
			.catch(error => console.log(error));
		if(newUnlikedVideo.message){
			// Display error message if included in response
			alert(newUnlikedVideo.message);
		} else if(newUnlikedVideo) {
			// Update the video state to remove like from the current user. Used immediately after unliking.
			newUnlikedVideo.likedByCurrentUser = false;
			let newVideos = this.state.videos;
			newVideos[newVideos.indexOf(video)] = newUnlikedVideo;
			// Remove video from user's liked videos. Used when a re-render occurs.
			let newUserLikedVideos = [];
			this.state.userLikedVideos.forEach((userLikedVideo) => {
				if(userLikedVideo._id != video._id){
					newUserLikedVideos.push(userLikedVideo);
				}
			});
			this.setState({
				videos: newVideos,
				userLikedVideos: newUserLikedVideos
			});
		}
	}

	async handleUserProfileNavigation(userID){
		let user = await fetch(`${process.env.APP_SERVER_URL}/user/${userID}`)
			.then((response) => response.json())
			.catch((e) => console.log(e));
		this.props.navigation.navigate('Account Profile', { user });
	}

	render(){

		var apiBaseURL = process.env.APP_SERVER_URL;
		var keywords = this.state.keywords;

		return (
			<ScrollView>		
				<View style={Styles.pad}>	
					<Text style={Styles.heading}>Videos</Text>
					<Searchbar type="text" placeholder="Search video submissions" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
						style={{
							borderWidth: 1,
							borderColor: 'black'
						}}
						onIconPress={() => this.handleSearch(`${apiBaseURL}/videos.json?keywords=${this.state.keywords}`)}
						onSubmitEditing={() => this.handleSearch(`${apiBaseURL}/videos.json?keywords=${this.state.keywords}`)}
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
								this.handleSearch(`${apiBaseURL}/videos.json?keywords=${this.state.keywords}`)
							}>Search Videos</Button>
						</View>
					</View>
				    <View style={{...Styles.flex, ...Styles.xCenter}}>
					    <View style={Styles.halfPad}>
							<Button icon="refresh" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={
								() => {
									this.setState({keywords: ''});
									this.handleChangePage(`${apiBaseURL}/videos.json?page=${this.state.currentPage}`);
								}
							}>Refresh</Button>
					    </View>
					    <View style={Styles.halfPad}>
						    <Button icon="cancel" mode="outlined" contentStyle={{flexDirection: 'row-reverse'}} onPress={
								() => {
									this.setState({keywords: ''});
									this.handleChangePage(`${apiBaseURL}/videos.json`);
								}
						    }>Clear filters</Button>
					    </View>
				    </View>
			    </View>
				<View>
					<View style={Styles.pad}>
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
											labelStyle={this.state.pages.indexOf(page) + 1 == this.state.currentPage ? {color: 'white'} : {}}
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
					{this.state.videos.length ?
						<View>
							{this.state.videos.map((video) => 
								<View key={video._id}>
									<View style={Styles.pad}>
										<View style={{...Styles.flex, ...Styles.xSpaceBetween, ...Styles.yCenter}}>
											<View style={{ maxWidth: 260 }}>
												<ReadMore
													numberOfLines={1}
												>
													<Text style={Styles.subHeading}>{video.title}</Text>
												</ReadMore>
											</View>
											{video.uploadedBy._id ?
												<View>
													<TextButton title={`By: ${video.uploadedBy.displayName}`} onPress={() => this.handleUserProfileNavigation(video.uploadedBy._id)}/>
												</View>
												:
												<View>
													<Text>By: {video.uploadedBy.displayName}</Text>
												</View>
											}
										</View>
										{video.src ?
											<View>
												<VideoComponent video={video}/>
											</View>
											:
											<Text>No Video Source</Text>
										}
										<View style={{ ...Styles.flex, ...Styles.xSpaceAround, ...Styles.yCenter }}>
											<Text>Likes: {video.likes || 0}</Text>
											{video.likedByCurrentUser ?
												<Button icon="star" onPress={() => this.removeLike(video)}>
													Liked
												</Button>
												:
												<Button icon="star-outline" onPress={() => this.sendLike(video)}>
													Like
												</Button>
											}
										</View>
									</View>
								</View>
							)}
						</View>
						:
						<Text>Loading</Text>
					}
					<View style={Styles.pad}>
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
											labelStyle={this.state.pages.indexOf(page) + 1 == this.state.currentPage ? {color: 'white'} : {}}
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
				</View>
			</ScrollView>
		);
	}
}

export default VideosIndex;