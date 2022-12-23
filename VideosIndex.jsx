import React from 'react';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { parse as URLParse } from 'search-params';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
import VideoComponent from './VideoComponent.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import VideoSearchForm from './VideoSearchForm.jsx';
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
			if(authenticatedUser.userLikedVideos){
				this.setState({
					userLikedVideos: authenticatedUser.userLikedVideos
				});
			}
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
					<VideoSearchForm
						keywords={keywords}
					/>
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
										<VideoPlayer
											_id={video._id}
											title={video.title}
											languageOfTopic={video.languageOfTopic}
											src={video.src}
											thumbnailSrc={video.thumbnailSrc}
											uploadedBy={video.uploadedBy}
											likes={video.likes}
											likedByCurrentUser={this.currentUserHasLikedVideo(video)}
											authenticatedUserID={this.state.userID}
										/>
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