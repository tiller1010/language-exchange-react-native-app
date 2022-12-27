import * as React from 'react';
import { Text, View, Image, Button as TextButton, ImageBackground } from 'react-native';
import Styles from './Styles.js';

export default function HomepageBanner(props) {
	return (
		<View>
			<ImageBackground
				resizeMode={'cover'} 
				source={{ uri: `${process.env.APP_SERVER_URL}/images/glacier-landscape.jpeg` }}
				style={{ position: 'relative' }}
			>
				<View style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: 'linear-gradient(to bottom, #747de8, #9f74e4)',
					opacity: '.1',
					top: 0,
					left: 0,
				}}></View>
				<View>
					<View style={{ ...Styles.pad, ...Styles.noXPad }}>
						<View style={{ ...Styles.homeBannerContent, ...Styles.pad }}>
							<View style={Styles.pad}>
								<Text style={{ ...Styles.heading, ...Styles.textWhite }}>Use the language you are learning today</Text>
								<Text style={{ ...Styles.subHeading, ...Styles.textWhite }}>Language can only be learned if it is used. Why not start using the language you want to learn today?</Text>
							</View>
						</View>
					</View>
				</View>
				<View>
					<View style={Styles.pad}>

						<View style={Styles.pad}>
							<View style={{ ...Styles.homeBannerLink, ...Styles.pad }}>
								<Text style={{ ...Styles.subHeading, ...Styles.textWhite }}>Improve your skills</Text>
								<Text style={Styles.textWhite}>
									Learn from free resources and challenges to sharpen your skills.
								</Text>
								<TextButton title="Learn more" onPress={props.navigation.navigate('Lessons', {})} />
							</View>
						</View>

						<View style={Styles.pad}>
							<View style={{ ...Styles.homeBannerLink, ...Styles.pad }}>
								<Text style={{ ...Styles.subHeading, ...Styles.textWhite }}>Share what you know</Text>
								<Text style={Styles.textWhite}>
									Browse words and phrases uploaded by users around the world.
								</Text>
								<TextButton title="Learn more" onPress={props.navigation.navigate('Videos', {})} />
							</View>
						</View>

						<View style={Styles.pad}>
							<View style={{ ...Styles.homeBannerLink, ...Styles.pad }}>
								<Text style={{ ...Styles.subHeading, ...Styles.textWhite }}>Practice with a native speaker</Text>
								<Text style={Styles.textWhite}>
									Schedule a time to have a real chat with a native speaker.
								</Text>
								<TextButton title="Learn more" onPress={props.navigation.navigate('Chats', {})} />
							</View>
						</View>

					</View>
				</View>

			</ImageBackground>
		</View>
	);
}