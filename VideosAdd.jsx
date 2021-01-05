import React from 'react';
import { ImageBackground, StyleSheet, Text, View, TextInput, Button, Image, ScrollView, FlatList } from 'react-native';
import { Video } from 'expo-av';
// import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

class VideosAdd extends React.Component {
	constructor(){
		super();
		this.state = {
		}
		this.handleThumbnailUploadChange = this.handleThumbnailUploadChange.bind(this);
		this.handleVideoUploadChange = this.handleVideoUploadChange.bind(this);
	}

	componentDidMount(){
	}

	async handleThumbnailUploadChange(event){
		const imageOptions = {
			noData: true
		}
		let response = await ImagePicker.launchImageLibraryAsync(imageOptions);
		if(response.uri){
			this.setState({
				thumbnail: response
			});
		}
		
		// let key = event.target.name;
		// let newState = {};
	 //    let image = event.target.files[0];
	 //    if(image){
		// 	newState[key] = image.name;
		// 	this.setState(newState);

	 //    	// Set preview
	 //    	let reader = new FileReader();
	 //    	let frame = document.querySelector(`.${key}-preview`);
		// 	reader.addEventListener('load', function () {
		// 		if(/jpeg|jpg|png/.test(reader.result.substr(0, 20))){
		// 		  frame.style.background = `url(${ reader.result }) no-repeat center center/cover`;
		// 		} else {
		// 			alert('Invalid thumbnail format.');
		// 		}

		// 	}, false);
	 //    	reader.readAsDataURL(image);
	 //    }
	}

	async handleVideoUploadChange(event){
		const videoOptions = {
			mediaTypes: ImagePicker.MediaTypeOptions.Videos
		}
		let response = await ImagePicker.launchImageLibraryAsync(videoOptions);
		if(response.uri){
			this.setState({
				video: response
			});
		}
		// let key = event.target.name;
		// let newState = {};
	 //    let video = event.target.files[0];
	 //    if(video){
		// 	newState[key] = video.name;
		// 	this.setState(newState);

	 //    	// Set preview
	 //    	let reader = new FileReader();
	 //    	let frame = document.querySelector(`.${key}-preview`);
		// 	reader.addEventListener('load', function () {
		// 		if(/mp4/.test(reader.result.substr(0, 20))){
		// 			  frame.src = `${ reader.result }`;
		// 		} else {
		// 			alert('Invalid video format.');
		// 		}
		// 	}, false);
	 //    	reader.readAsDataURL(video);
	 //    }
	}
				
	render(){

		return (
			<View className="pad">
				<Text>Video Add</Text>
				<View className="flex">
					<View className="pure-u-1-2">
						<Text>Video Preview</Text>
						<Video
							source={this.state.video}
							ref={(ref) => {
								this.player = ref
							}}
							style={{height: 225, width: '100%'}}
							// usePoster={true}
							useNativeControls={true}
						/>
					</View>
					<View className="pure-u-1-2">
						<Text>Thumbnail Preview</Text>
						<ImageBackground className="thumbnail-preview" source={this.state.thumbnail} style={{height: 225, width: '100%'}}></ImageBackground>
					</View>
				</View>
				<View action="/videos/add" method="POST" encType="multipart/form-data">
					<TextInput type="text" name="title" required/>
					<View style={{display: 'flex'}}>
						<Button title="Upload Video" name="video" onPress={this.handleVideoUploadChange} required/>
					</View>
					<View style={{display: 'flex'}}>
						<Button title="Upload Thumbnail" name="thumbnail" onPress={this.handleThumbnailUploadChange} required/>
					</View>
					<Button title="Submit"/>
				</View>
			</View>
		);
	}
}

export default VideosAdd;