import React from 'react';
import { ImageBackground, Text, View, TextInput, Button, Image, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

function createFormData(title, video, thumbnail){
  const data = new FormData();

  data.append('nativeFlag', true);

  data.append('title', title);

  var videoFileExtension = video.uri.slice(video.uri.length - 3, video.uri.length);
  var videoType = videoFileExtension === 'mov' ? 'video/quicktime' : 'video' ;
  var videoData = {
    name: title + '-video.' + videoFileExtension,
    type: videoType,
    uri:
      Platform.OS === 'android' ? video.uri : video.uri.replace('file://', '')
  }
  data.append('video', videoData);

  var thumbnailData = {
    name: title + '-thumbnail',
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
		if(this.props.route.params){
			if(this.props.route.params.challenge){
				this.setState({
					title: this.props.route.params.challenge
				});
			}
		}
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
			mediaTypes: ImagePicker.MediaTypeOptions.Videos,
			videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality
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
			console.log('Fetching from:', process.env.APP_SERVER_URL);
			fetch(`${process.env.APP_SERVER_URL}/videos/add`, {
				method: 'POST',
				mode: 'no-cors',
				body: createFormData(state.title, state.video, state.thumbnail)
			}).then((response) => response)
			  .then((data) => console.log(data))
			  .then(this.createAlert('Uploaded Successfully', true))
			  .catch((e) => console.log(e));
		} else {
			this.createAlert('Complete the form before submitting');
		}
	}

	createAlert(alertPhrase, clearState = false){

		const emptyVideo = {
			cancelled: false,
			duration: 1000,
			height: 1000,
			type: 'video',
			uri: '',
			width: 720
		}
		Alert.alert(
			alertPhrase,
			'',
			[{
				text: 'Close',
				onPress: () => {
					if(clearState){
						this.setState({title: '', video: emptyVideo, thumbnail: null})
					}
				}
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