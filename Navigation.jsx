import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import AppStackScreen from './AppStackScreen.jsx';

class Navigation extends React.Component {
	constructor(props){
		super(props);
		  this.state = {
		    index: 0,
		    routes: [
				{key: 'Home', title: 'Home', icon: 'home'},
				{key: 'VideosIndex', title: 'Videos', icon: 'play'},
				{key: 'VideosAdd', title: 'Add Video', icon: 'plus'},
				{key: 'AccountProfile', title: 'Account Profile', icon: 'account'}
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
			/>
		);
	}
}

export default Navigation;