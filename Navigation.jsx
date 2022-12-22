import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import AppStackScreen from './AppStackScreen.jsx';

class Navigation extends React.Component {
	constructor(props){
		super(props);
		  this.state = {
		    index: 0,
		    routes: [
				{key: 'Home', title: 'Home', unfocusedIcon: 'home', focusedIcon: 'home'},
				{key: 'VideosIndex', title: 'Videos', unfocusedIcon: 'play', focusedIcon: 'play'},
				{key: 'VideosAdd', title: 'Add Video', unfocusedIcon: 'plus', focusedIcon: 'plus'},
				{key: 'AccountProfile', title: 'Account Profile', unfocusedIcon: 'account', focusedIcon: 'account'}
			]
		}
		this.handleIndexChange = this.handleIndexChange.bind(this);
	}

	handleIndexChange(index){
		this.setState({ index })
	}

	render(){
		return (
			<BottomNavigation
				navigationState={this.state}
		        onIndexChange={this.handleIndexChange}
				renderScene = {({ route, jumpTo }) => {
					return <AppStackScreen initialRouteName={route.title} jumpTo={jumpTo} />;
				}}
				inactiveColor="white"
				activeColor="black"
				barStyle={{ backgroundColor: '#9f74e4' }}
			/>
		);
	}
}

export default Navigation;