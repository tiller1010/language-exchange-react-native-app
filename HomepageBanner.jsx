import * as React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView } from 'react-native';

export default function HomepageBanner(props) {
	return (
		<View className="home-banner flex-container fw-typography-spacing" style={{background: `url("${process.env.APP_SERVER_URL}/images/glacier-landscape.jpeg") no-repeat center center/cover`}}>
			<View style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				background: 'linear-gradient(to bottom, #747de8, #9f74e4)',
				opacity: '.1',
				top: '0',
				left: '0',
			}}></View>
			<View className="desktop-100 home-banner-content" style={{ position: 'relative' }}>
				<View className="fw-container">
					<View className="fw-space">
						<Text style={{ marginBottom: '5px' }}>Use the language you are learning today</Text>
						<Text>Language can only be learned if it is used. Why not start using the language you want to learn today?</Text>
					</View>
				</View>
			</View>
			<View className="desktop-100 fw-container flex-container flex-vertical-bottom" style={{ position: 'relative' }}>
				<View className="fw-space">
					<View className="flex-container flex-vertical-stretch">

						<View className="desktop-33 tablet-100">
							<View className="fw-space">
								<View className="fw-space">
									<Text style={{ marginBottom: '5px' }}>Improve your skills</Text>
									<Text>
										Learn from free resources and challenges to sharpen your skills.
									</Text>
									<TextButton title="Learn more" onPress={props.navigation.navigate('Lessons', {})} />;
								</View>
							</View>
						</View>

						<View className="desktop-33 tablet-100">
							<View className="fw-space">
								<View className="fw-space">
									<Text style={{ marginBottom: '5px' }}>Share what you know</Text>
									<Text>
										Browse words and phrases uploaded by users around the world.
									</Text>
									<TextButton title="Learn more" onPress={props.navigation.navigate('Lessons', {})} />;
								</View>
							</View>
						</View>

						<View className="desktop-33 tablet-100">
							<View className="fw-space">
								<View className="fw-space">
									<Text style={{ marginBottom: '5px' }}>Practice with a native speaker</Text>
									<Text>
										Schedule a time to have a real chat with a native speaker.
									</Text>
									<TextButton title="Learn more" onPress={props.navigation.navigate('Lessons', {})} />;
								</View>
							</View>
						</View>

					</View>
				</View>
			</View>
		</View>
	);
}