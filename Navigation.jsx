import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeStackScreen from './HomeStackScreen.jsx';
import VideosIndex from './VideosIndex.jsx';
import VideosAdd from './VideosAdd.jsx';

class Navigation extends React.Component {
	constructor(props){
		super(props);
		  this.state = {
		    index: 0,
		    routes: [
				{key: 'Home', title: 'Home', icon: 'home'},
				{key: 'VideosIndex', title: 'Videos', icon: 'play'},
				{key: 'VideosAdd', title: 'Add Video', icon: 'plus'}
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
				renderScene={BottomNavigation.SceneMap({
					Home: HomeStackScreen,
					VideosIndex: VideosIndex,
					VideosAdd: VideosAdd
				})}
				inactiveColor="white"
				activeColor="black"
			/>
		);
	}
}

export default Navigation;