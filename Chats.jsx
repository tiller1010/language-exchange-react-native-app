import React from 'react';
import PremiumVideoChatListingFeed from './PremiumVideoChatListingFeed.jsx';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
// import decipher from '../decipher.js';

class Chats extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}

	componentDidMount() {

		// const myDecipher = decipher(process.env.PROP_SALT);

		// let newState = {};
		// if (this.props.isLive) {
		// 	let encryptedProps = myDecipher(this.props.p);
		// 	encryptedProps = JSON.parse(encryptedProps);
		// 	newState = {
		// 		authenticatedUserID: encryptedProps.authenticatedUserID,
		// 	}
		// } else {
		// 	newState = {
		// 		authenticatedUserID: this.props.authenticatedUserID,
		// 	}
		// }
		// this.setState(newState)
	}

	render(){

		return (
			<ScrollView>
				<View className="pure-u-g">

					<View className="desktop-100">
						<PremiumVideoChatListingFeed
							authenticatedUserID={this.state.authenticatedUserID}
							SearchFormHeading="Chats with native speakers"
							navigation={this.props.navigation}
						/>
					</View>

			    </View>
			</ScrollView>
		);
	}
}

export default Chats;