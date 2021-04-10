import React from 'react';
import { Text, View, Image, Button as TextButton, ScrollView, Alert } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, TextInput, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'

class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errors: [],
			firstName: '',
			lastName: '',
			displayName: '',
			password: '',
			confirmPassword: ''
		}
		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.createAlert = this.createAlert.bind(this);
	}

	componentDidMount(){
		if(this.props.errors){
			this.setState({
				errors: JSON.parse(this.props.errors)
			});
		}
	}
	
	handleTextChange(text, field){
		switch(field){
			case 'firstName':
				this.setState({
					firstName: text
				});
			break;
			case 'lastName':
				this.setState({
					lastName: text
				});
			break;
			case 'displayName':
				this.setState({
					displayName: text
				});
			break;
			case 'password':
				this.setState({
					password: text
				});
			break;
			case 'confirmPassword':
				this.setState({
					confirmPassword: text
				});
			break;
		}
	}

	async handleSubmit(){
		const state = {...this.state};
		if(state.firstName
			&& state.lastName
			&& state.displayName
			&& state.password
			&& state.confirmPassword
		){
			if(state.password !== state.confirmPassword){
				this.createAlert('Passwords do not match.');
				return;
			}
			console.log('Fetching from:', process.env.APP_SERVER_URL);
			await fetch(`${process.env.APP_SERVER_URL}/react-native-register`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					nativeFlag: true,
					firstName: state.firstName,
					lastName: state.lastName,
					displayName: state.displayName,
					password: state.password,
					confirmPassword: state.confirmPassword
				})
			}).then((response) => response.json())
			  .then(async (user) => {
				  	if(user._id){
						await AsyncStorage.setItem('@user', JSON.stringify(user));
						this.props.navigation.navigate('Account Profile', { user });
				  	}
				})
			  .catch((e) => this.createAlert('Login invalid', true));
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
					}
				}
			}]
		);
	}

	render(){
		return (
			<ScrollView>
				<View style={Styles.pad}>
					{this.state.errors.length ?
						<View>
							{this.state.errors.map((error) =>
								<Text key={this.state.errors.indexOf(error)}>
									{error}
								</Text>
							)}
						</View>
						:
						<Text></Text>
					}
					<View>
						<View>
							<TextInput label="First Name" onChangeText={(text) => this.handleTextChange(text, 'firstName')} value={this.state.firstName}/>
						</View>
						<View>
							<TextInput label="Last Name" onChangeText={(text) => this.handleTextChange(text, 'lastName')} value={this.state.lastName}/>
						</View>
						<View>
							<TextInput label="Display Name" onChangeText={(text) => this.handleTextChange(text, 'displayName')} value={this.state.displayName}/>
						</View>
						<View>
							<TextInput label="Password" onChangeText={(text) => this.handleTextChange(text, 'password')} value={this.state.password} secureTextEntry/>
						</View>
						<View>
							<TextInput label="Confirm Password" onChangeText={(text) => this.handleTextChange(text, 'confirmPassword')} value={this.state.confirmPassword} secureTextEntry/>
						</View>
						<View>
							<Button icon="arrow-right" mode="contained" labelStyle={{color: 'white'}} contentStyle={{flexDirection: 'row-reverse'}} onPress={this.handleSubmit}>
								Register
							</Button>
						</View>
					</View>
					<Button icon="google" contentStyle={{flexDirection: 'row-reverse'}} onPress={() =>
						this.props.navigation.navigate('Register')
					}>Register with Google</Button>
				</View>
			</ScrollView>
		);
	}
}

export default Register;