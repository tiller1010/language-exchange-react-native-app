import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
			currentPage: 1
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
			<View>
				<Text>The currentPage is {this.state.currentPage}</Text>
				<View>
					<Text style={buttonStyles} onPress={this.nextPage}>Next</Text>
				</View>
			</View>
		);
	}
}

export default Marquee;