import React from 'react';
import { ImageBackground, Text, View, TextInput, Button, Image, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

function createFormData(title, video, thumbnail){
  const data = new FormData();

  data.append('nativeFlag', true);

  data.append('title', title);

  var videoData = {
    name: 'video',
    type: video.type,
    uri:
      Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '')
  }
  data.append('video', videoData);

  var thumbnailData = {
    name: 'thumbnail',
    type: thumbnail.type,
    uri:
      Platform.OS === 'android' ? thumbnail.uri : thumbnail.uri.replace('file://', '')
  }
  data.append('thumbnail', thumbnailData);

  return data;
}

class VideosAdd extends React.Component {
	constructor(){
		super();
		this.state = {
			title: ''
		}
		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleThumbnailUploadChange = this.handleThumbnailUploadChange.bind(this);
		this.handleVideoUploadChange = this.handleVideoUploadChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.createAlert = this.createAlert.bind(this);
	}

	componentDidMount(){
	}

	handleTextChange(text){
		this.setState({
			title: text
		})
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

	async handleSubmit(){
		const state = {...this.state};
		if(state.title && state.video && state.thumbnail){
			fetch('http://192.168.1.5:3000/videos/add', {
				method: 'POST',
				mode: 'no-cors',
				body: createFormData(state.title, state.video, state.thumbnail)
			}).then((response) => response)
			  .then((data) => console.log(data))
			  .then(this.createAlert())
			  .catch((e) => console.log(e));
		}
	}

	createAlert(){

		const emptyVideo = {
			cancelled: false,
			duration: 1000,
			height: 1000,
			type: 'video',
			uri: '',
			width: 720
		}
		Alert.alert(
			'Uploaded Successfully',
			'',
			[{
				text: 'Close',
				onPress: () => this.setState({title: '', video: emptyVideo, thumbnail: null})
			}]
		);
	}
				
	render(){

		return (
			<ScrollView>
				<Text style={Styles.heading}>Video Add</Text>
				<View>
					<Text style={Styles.subHeading}>Title:</Text>
					<TextInput type="text" onChangeText={(text) => this.handleTextChange(text)} defaultValue={this.state.title} required
						style={{
							borderWidth: 1,
							borderColor: 'black'
						}}
					/>
					<View style={{display: 'flex'}}>
						<Button title="Upload Video" onPress={this.handleVideoUploadChange} required/>
					</View>
					<View style={{display: 'flex'}}>
						<Button title="Upload Thumbnail" onPress={this.handleThumbnailUploadChange} required/>
					</View>
					<Button title="Submit" onPress={this.handleSubmit}/>
				</View>
				<View>
					<View>
						<Text style={Styles.subHeading}>Video Preview</Text>
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
						<Text style={Styles.subHeading}>Thumbnail Preview</Text>
						<ImageBackground source={this.state.thumbnail} style={{height: 225, width: '100%'}}></ImageBackground>
					</View>
				</View>
			</ScrollView>
		);
	}
}

export default VideosAdd;