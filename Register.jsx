import React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, TextInput, Menu } from 'react-native-paper';

class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errors: []
		}
	}

	componentDidMount(){
		if(this.props.errors){
			this.setState({
				errors: JSON.parse(this.props.errors)
			});
		}
	}

	render(){
		return (
			<ScrollView className="frame">

				<View className="page-form">
					<Text>Register</Text>

					{this.state.errors.length ?
						<View className="errors">
							{this.state.errors.map((error) =>
								<Text key={this.state.errors.indexOf(error)}>
									{error}
								</Text>
							)}
						</View>
						:
						<Text></Text>
					}

					<View action="/register" method="POST" className="flex-col x-end">
						<View className="small-pad no-x">
							<TextInput type="text" name="firstName" placeholder="First Name" aria-label="first name"/>
						</View>
						<View className="small-pad no-x">
							<TextInput type="text" name="lastName" placeholder="Last Name" aria-label="last name"/>
						</View>
						<View className="small-pad no-x">
							<TextInput type="text" name="displayName" placeholder="Display Name" aria-label="display name"/>
						</View>
						<View className="small-pad no-x">
							<TextInput type="password" name="password" placeholder="Password" aria-label="password"/>
						</View>
						<View className="small-pad no-x">
							<TextInput type="password" name="confirmPassword" placeholder="Confirm Password" aria-label="confirm password"/>
						</View>
						<View className="small-pad no-x">
							<Button type="submit">
								Register
								{/*<FontAwesomeIcon icon={faLongArrowAltRight}/>*/}
							</Button>
						</View>
					</View>
				    <Button href="/auth/google" className="button">
					    Register with Google
					    {/*<FontAwesomeIcon icon={faGoogle}/>*/}
				    </Button>
				</View>
			</ScrollView>
		);
	}
}

export default Register;