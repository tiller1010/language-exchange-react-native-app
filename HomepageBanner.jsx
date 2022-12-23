import * as React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView, ImageBackground } from 'react-native';

export default function HomepageBanner(props) {
	return (
		<View>
			<ImageBackground
				resizeMode={'cover'} 
				source={{ uri: `${process.env.APP_SERVER_URL}/images/glacier-landscape.jpeg` }}
			>
				<View className="desktop-100 home-banner-content" style={{ position: 'relative' }}>
					<View className="fw-container">
						<View className="fw-space">
							<Text style={{ marginBottom: 5 }}>Use the language you are learning today</Text>
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
										<Text style={{ marginBottom: 5 }}>Improve your skills</Text>
										<Text>
											Learn from free resources and challenges to sharpen your skills.
										</Text>
										<TextButton title="Learn more" onPress={props.navigation.navigate('Lessons', {})} />
									</View>
								</View>
							</View>

							<View className="desktop-33 tablet-100">
								<View className="fw-space">
									<View className="fw-space">
										<Text style={{ marginBottom: 5 }}>Share what you know</Text>
										<Text>
											Browse words and phrases uploaded by users around the world.
										</Text>
										<TextButton title="Learn more" onPress={props.navigation.navigate('Videos', {})} />
									</View>
								</View>
							</View>

							<View className="desktop-33 tablet-100">
								<View className="fw-space">
									<View className="fw-space">
										<Text style={{ marginBottom: 5 }}>Practice with a native speaker</Text>
										<Text>
											Schedule a time to have a real chat with a native speaker.
										</Text>
										<TextButton title="Learn more" onPress={props.navigation.navigate('Chats', {})} />
									</View>
								</View>
							</View>

						</View>
					</View>
				</View>

			</ImageBackground>
		</View>
	);
}