import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, FlatList } from 'react-native';

// const buttonStyles = StyleSheet.create({
// 	container: {
// 	    flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		padding: '20 30px',
// 		backgroundColor: '#555',
// 		color: '#fff'
// 	}
// });

const buttonStyles = {
    display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: 'skyblue',
	color: 'white',
	height: 150,
	width: 150
}

class Marquee extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			currentPage: 1,
			name: ''
		}
		this.nextPage = this.nextPage.bind(this);
	}

	nextPage(){
		var currentPage = this.state.currentPage;
		this.setState({
			currentPage: currentPage + 1
		});
	}

	render(){
		return(
			<ScrollView>
				<View>
				<FlatList
					data={[
						{key:'Wake up'},
						{key:'Make coffee'},
						{key:'Do sign'},
						{key:'Turn on pc'},
					]}
					renderItem={({item}) => <Text>{item.key}</Text>}
				/>
				<Text>The currentPage is {this.state.currentPage}</Text>
				<View>
					<Button style={buttonStyles} onPress={this.nextPage} title="Next"/>
				</View>
				<Text>Your name: {this.state.name}</Text>
				<TextInput style={{height: 40}} onChangeText={(text) => this.setState({name: text})} />
				</View>
			</ScrollView>
		);
	}
}

export default Marquee;