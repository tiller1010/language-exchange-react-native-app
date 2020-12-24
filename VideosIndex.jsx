import React from 'react';
// import lozad from 'lozad';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView, FlatList } from 'react-native';

async function getVideos(){
	var urlParams = new URLSearchParams(window.location.search);
	var searchKeywords = urlParams.get('keywords') || '';
	var page = urlParams.get('page') || '';
	return fetch(`${document.location.origin}/videos.json?${searchKeywords ? 'keywords=' + searchKeywords + '&' : ''}${page ? 'page=' + page : ''}`)
		.then((response) => response.json());
}

// Enable lazy loading
// const lozadObserver = lozad();
// lozadObserver.observe();

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

		// var newVideos = await getVideos();
		// if(newVideos){
		// 	this.setState({
		// 		videos: newVideos.videos,
		// 		pages: this.pagination(newVideos.pages),
		// 		currentPage: page
		// 	});
		// }
	}

	async refreshVideos(){
		var urlParams = new URLSearchParams(window.location.search);
		var page = urlParams.get('page') || 1;

		var newVideos = await getVideos();
		if(newVideos){
			this.setState({
				videos: newVideos.videos,
				pages: this.pagination(newVideos.pages),
				currentPage: page
			});
		}
	}

	handleChangePage(event){
		event.preventDefault();
		window.history.pushState({}, '', event.target.href);
		this.refreshVideos();
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

		return (
			<View className="pad">			
				<Text>Videos</Text>
				<View>
					<Button title="Button Placeholder" href={`/`}/>
				</View>
				<Button title="Refresh" onClick={this.refreshVideos}/>
				<View action="/videos" method="GET" onSubmit={this.handleSearch}>
					<Text htmlFor="keywords">Search Terms</Text>
					<TextInput type="text" name="keywords"/>
					<TextInput type="submit" value="Search"/>
				</View>
			    <View>
				    <Button title="Clear filters" onClick={this.handleChangePage} href="/videos"/>
			    </View>
			    <View>
				    <Button title="Add a video" href="/videos/add"/>
			    </View>
				<View>
					{this.state.pages.length ?
						<View className="pagination flex">
							{this.state.currentPage > 1 ?
								<View>
									<Button title="Prev" onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`}/>
								</View>
								:
								''
							}
							{this.state.pages.map((page) =>
								<View key={this.state.pages.indexOf(page)}>
									<Button title={page.pageNumber} onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`}/>
								</View>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<View>
									<Button title="Next" onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`}/>
								</View>
								:
								''
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
									<View style={{height: '300px'}}>
										<video type="video/mp4" className="video-preview lozad" height="225" width="400" poster={
											video.thumbnailSrc || "/images/videoPlaceholder.png"
										} controls>
											<source src={video.src}></source>
										</video>
									</View>
								</View>
							)}
						</View>
						:
						<Text>No videos</Text>
					}
					{this.state.pages.length ?
						<View className="pagination flex">
							{this.state.currentPage > 1 ?
								<View>
									<Button title="Prev" onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) - 1}`}/>
								</View>
								:
								''
							}
							{this.state.pages.map((page) =>
								<View key={this.state.pages.indexOf(page)}>
									<Button title={page.pageNumber} onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${page.pageNumber}`}/>
								</View>
							)}
							{this.state.currentPage < this.state.pages.length ?
								<View>
									<Button title="Next" onClick={this.handleChangePage} href={`/videos?${keywords ? 'keywords=' + keywords + '&' : ''}page=${Number(this.state.currentPage) + 1}`}/>
								</View>
								:
								''
							}
						</View>
						:
						<Text></Text>
					}
				</View>
			</View>
		);
	}
}

export default VideosIndex;