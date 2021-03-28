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
				  switch (route.key) {
				    case 'Home':
				      return <AppStackScreen initialRouteName="Home" jumpTo={jumpTo} />;
				    break;
				    case 'VideosIndex':
				      return <AppStackScreen initialRouteName="Videos" jumpTo={jumpTo} />;
				    break;
				    case 'VideosAdd':
				      return <AppStackScreen initialRouteName="Add Video" jumpTo={jumpTo} />;
				    break;
				    case 'Login':
				      return <AppStackScreen initialRouteName="Login" jumpTo={jumpTo} />;
				    break;
				    case 'Register':
				      return <AppStackScreen initialRouteName="Register" jumpTo={jumpTo} />;
				    break;
				    case 'AccountProfile':
				      return <AppStackScreen initialRouteName="Account Profile" jumpTo={jumpTo} />;
				    break;
				  }
				}}
				inactiveColor="white"
				activeColor="black"
			/>
		);
	}
}

export default Navigation;