import React from 'react';
import { View, Platform } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button } from 'react-native-paper';

// Stateful button component that disappears after pressed
class PlayButton extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			display: 'block'
		}
		this.handlePressPlay = this.handlePressPlay.bind(this);
	}

	handlePressPlay(){
		this.setState({
			display: 'none'
		});
		this.props.callback();
	}

	render(){
		return(
			<Button
				icon="play"
				style={{
					position: 'absolute',
					width: '100%',
					display: this.state.display
				}}
				labelStyle={{
					color: 'white',
					fontSize: 100
				}}
				contentStyle={{
					height: 225,
					alignItems: 'center'
				}}
				onPress={this.handlePressPlay}
			></Button>
		);
	}
}

// Stateless video component that passes callback function to play button component
const VideoComponent = (props) => {

	var video = props.video;
	var apiBaseURL = process.env.APP_SERVER_URL;
	var ref = React.useRef(null);
	var isWeb = Platform.OS === 'web';

	return(
		<View>
			<Video
				posterSource={{uri: video.thumbnailSrc ? video.thumbnailSrc : apiBaseURL + '/images/videoPlaceholder.png'}}
				ref={ref}
				style={{position: 'relative', height: 225, width: '100%', borderRadius: 25, overflow: 'hidden'}}
				usePoster={true}
				posterStyle={{height: '100%', width: '100%', resizeMode: 'cover'}}
				useNativeControls={isWeb}
				source={isWeb ? { uri: video.src } : {}}
			/>
			{!isWeb ?
				<PlayButton callback={() => {
					if(ref){
						ref.current.loadAsync({uri: video.src})
							.then(() => {
								ref.current.setState({
									showPoster: false
								});
							})
							.then(() => {
								ref.current.playAsync();
							});
					}
				}}/>
				:
				<></>
			}
		</View>
	);
}

export default VideoComponent;