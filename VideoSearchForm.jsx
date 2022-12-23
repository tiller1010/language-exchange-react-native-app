import React from 'react';
import axios from 'axios';
import { Text, View, TextInput, Image, Button as TextButton, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Styles from './Styles.js';
import { Button, RadioButton, Searchbar, Menu } from 'react-native-paper';
// import LanguageSelector from './LanguageSelector.js';

export default class VideoSearchForm extends React.Component {
	constructor(props){
		super(props);
		let state = {
			keywords: '',
			languageOfTopic: '',
			sortControlStatus: '',
			sort: 'Recent'
		}
		this.state = state;
		this.toggleSortControls = this.toggleSortControls.bind(this);
		this.handleSortChange = this.handleSortChange.bind(this);
	}

	componentDidMount(){
		const { keywords, languageOfTopic, sort } = this.props;
		this.setState({
			keywords,
			languageOfTopic,
			sort
		});
	}

	componentDidUpdate(prevProps){
		if(this.props != prevProps){
			const { keywords, languageOfTopic, sort } = this.props;
			this.setState({
				keywords,
				languageOfTopic,
				sort
			});
		}
	}

	toggleSortControls(){
		let newStatus = this.state.sortControlStatus ? '' : 'visible';
		this.setState({
			sortControlStatus: newStatus
		});
	}

	handleSortChange(value){
		this.setState({
			sort: value,
			sortControlStatus: ''
		}, () => {
			this.props.navigation.navigate('Videos', {sort: this.state.sort, keywords: this.state.keywords || ''});
		});
	}

	render(){

		const { keywords, languageOfTopic, sortControlStatus, sort} = this.state;

		return(
			<View>
				<Searchbar type="text" placeholder="Search" onChangeText={(text) => this.setState({keywords: text})} value={this.state.keywords}
					style={{
						borderWidth: 1,
						borderColor: 'black'
					}}
					onIconPress={() => this.props.navigation.navigate('Videos', {keywords: this.state.keywords})}
					onSubmitEditing={() => this.props.navigation.navigate('Videos', {keywords: this.state.keywords})}
				/>
				<View style={{...Styles.flex, ...Styles.xCenter}}>
					<View style={Styles.halfPad}>
						<Menu
							anchor={<Button onPress={this.toggleSortControls} icon="tune" mode="contained" labelStyle={{color: 'white'}}>Search & Sort</Button>}
							visible={sortControlStatus}
						>
							<RadioButton.Group>
								<RadioButton.Item label="All" name="sort" value="" status={this.state.sort === '' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('')}/>
								<RadioButton.Item label="Oldest" name="sort" value="Oldest" status={this.state.sort === 'Oldest' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Oldest')}/>
								<RadioButton.Item label="Recent" name="sort" value="Recent" status={this.state.sort === 'Recent' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Recent')}/>
								<RadioButton.Item label="A-Z" name="sort" value="A-Z" status={this.state.sort === 'A-Z' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('A-Z')}/>
								<RadioButton.Item label="Z-A" name="sort" value="Z-A" status={this.state.sort === 'Z-A' ? 'checked' : 'unchecked'} onPress={() => this.handleSortChange('Z-A')}/>
							</RadioButton.Group>
							<Menu.Item icon="close" title="Close" onPress={this.toggleSortControls}/>
						</Menu>
					</View>
					<View style={Styles.halfPad}>
						<Button icon="magnify" mode="contained" labelStyle={{color: 'white'}} onPress={() =>
							this.props.navigation.navigate('Videos', {keywords: this.state.keywords})
						}>Search</Button>
					</View>
				</View>
			</View>
		);
	}
}