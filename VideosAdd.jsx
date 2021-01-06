import React from 'react';
import { ImageBackground, Text, View, TextInput, Button, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';
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
	}
				
	render(){

		return (
			<View>
				<Text>Video Add</Text>
				<View>
					<View>
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
					<View>
						<Text>Thumbnail Preview</Text>
						<ImageBackground source={this.state.thumbnail} style={{height: 225, width: '100%'}}></ImageBackground>
					</View>
				</View>
				<View>
					<TextInput type="text" name="title" required/>
					<View style={{display: 'flex'}}>
						<Button title="Upload Video" onPress={this.handleVideoUploadChange} required/>
					</View>
					<View style={{display: 'flex'}}>
						<Button title="Upload Thumbnail" onPress={this.handleThumbnailUploadChange} required/>
					</View>
					<Button title="Submit"/>
				</View>
			</View>
		);
	}
}

export default VideosAdd;