import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, ScrollView, FlatList } from 'react-native';
import { Video } from 'expo-av';
import { launchImageLibrary } from 'react-native-image-picker';

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

	handleThumbnailUploadChange(event){
		let imageOptions = {
			noData: true
		}
		launchImageLibrary(imageOptions, response => {
			if(response.uri){
				this.setState({
					thumbnail: response
				});
			}
		});
		
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

	handleVideoUploadChange(event){
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
				<Button title="Back" href={`/`}/>
				<View className="flex">
					<View className="pure-u-1-2">
						<Text>Video Preview</Text>
						<Video
							ref={(ref) => {
								this.player = ref
							}}
							style={{height: 225, width: 400}}
							// usePoster={true}
							useNativeControls={true}
						/>
					</View>
					<View className="pure-u-1-2">
						<Text>Thumbnail Preview</Text>
						<View className="thumbnail-preview" style={{height: 225, width: 400}}></View>
					</View>
				</View>
				<View action="/videos/add" method="POST" encType="multipart/form-data">
					<TextInput type="text" name="title" required/>
					<View style={{display: 'flex'}}>
						<Text htmlFor="video">Video</Text>
						<Button title="Upload Video" name="video" onPress={this.handleVideoUploadChange} required/>
					</View>
					<View style={{display: 'flex'}}>
						<Text htmlFor="thumbnail">Thumbnail</Text>
						<Button title="Upload Thumbnail" name="thumbnail" onPress={this.handleThumbnailUploadChange} required/>
					</View>
					<Button title="Submit"/>
				</View>
			</View>
		);
	}
}

export default VideosAdd;