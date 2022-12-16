import React from 'react';
import { ImageBackground, Text, View, Button as TextButton, Image, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Button, TextInput } from 'react-native-paper';
import Styles from './Styles.js';

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
		if(this.props.route){
			if(this.props.route.params){
				if(this.props.route.params.challenge){
					this.setState({
						title: this.props.route.params.challenge
					});
				}
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
				<View style={Styles.pad}>
					<Text style={Styles.heading}>Video Add</Text>
					<TextInput label="Title" mode="outlined" onChangeText={(text) => this.handleTextChange(text)} value={this.state.title} required/>
					<View style={{...Styles.halfPad, ...Styles.noXPad}}>
						<Button icon="upload" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={this.handleVideoUploadChange} required>
							Upload Video
						</Button>
					</View>
					<View style={{...Styles.halfPad, ...Styles.noXPad}}>
						<Button icon="upload" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={this.handleThumbnailUploadChange} required>
							Upload Thumbnail
						</Button>
					</View>
					<View style={{...Styles.halfPad, ...Styles.noXPad}}>
						<Button icon="plus" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={this.handleSubmit}>
							Submit
						</Button>
					</View>
				</View>
				<View>
					<View>
						<View style={Styles.pad}>
							<Text style={Styles.subHeading}>Video Preview</Text>
						</View>
						<View style={Styles.pad}>
							<Video
								source={this.state.video}
								ref={(ref) => {
									this.player = ref
								}}
								style={{height: 225, width: '100%', borderRadius: 25, borderWidth: 2, borderColor: 'black'}}
								useNativeControls={true}
							/>
						</View>
					</View>
					<View>
						<View style={Styles.pad}>
							<Text style={Styles.subHeading}>Thumbnail Preview</Text>
						</View>
						<View style={Styles.pad}>
							<ImageBackground source={this.state.thumbnail} style={{height: 225, width: '100%', borderRadius: 25, borderWidth: 2, borderColor: 'black', overflow: 'hidden'}}></ImageBackground>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}

export default VideosAdd;