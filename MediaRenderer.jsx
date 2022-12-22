import React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView } from 'react-native';
import VideoComponent from './VideoComponent.jsx';
import AudioComponent from './AudioComponent.jsx';

export default function MediaRenderer(props) {

	const { src, thumbnailSrc } = props;

	let fileExtension = props.fileExtension;
	if (src && !fileExtension) {
		fileExtension = src.split('.').reverse()[0];
	}

	switch(fileExtension){
		case 'svg':
		case 'png':
		case 'jpg':
		case 'jpeg':
			return (
				<View className="img-container">
					<Image source={{uri: src}}
						style={{height: 400, width: '100%'}}
					/>
				</View>
			);
		case 'mov':
		case 'mp4':
			return <VideoComponent video={props}/>
		case 'mp3':
		case 'wav':
			return (
				<View style={{
					height: '225px',
					width: '400px',
					backgroundImage: `url('${thumbnailSrc || process.env.APP_SERVER_URL + '/' + "/images/videoPlaceholder.png"}')`,
					backgroundSize: 'contain',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'center',
					borderRadius: '25px',
				    overflow: 'hidden',
				    maxWidth: '100%',
				}}>
					<AudioComponent src={src}/>
				</View>
			);
		case '':
			return '';
		default:
			return <VideoComponent video={props}/>
	}
}