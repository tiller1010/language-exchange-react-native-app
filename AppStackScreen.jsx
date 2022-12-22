import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home.jsx';
import VideosIndex from './VideosIndex.jsx';
import VideosAdd from './VideosAdd.jsx';
import Level from './Level.jsx';
import Topic from './Topic.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import AccountProfile from './AccountProfile.jsx';
import LessonsFeed from './LessonsFeed.jsx';
import Chats from './Chats.jsx';

const Stack = createStackNavigator();

class AppStackScreen extends React.Component {

    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName={this.props.initialRouteName}>
                  <Stack.Screen
                    name="Home"
                    component={Home}
                  />
                  <Stack.Screen
                    name="Videos"
                    component={VideosIndex}
                  />
                  <Stack.Screen
                    name="Add Video"
                    component={VideosAdd}
                  />
                  <Stack.Screen
                    name="Lessons"
                    component={LessonsFeed}
                  />
                  <Stack.Screen
                    name="Level"
                    component={Level}
                  />
                  <Stack.Screen
                    name="Topic"
                    component={Topic}
                  />
                  <Stack.Screen
                    name="Chats"
                    component={Chats}
                  />
                  <Stack.Screen
                    name="Login"
                    component={Login}
                  />
                  <Stack.Screen
                    name="Register"
                    component={Register}
                  />
                  <Stack.Screen
                    name="Account Profile"
                    component={AccountProfile}
                  />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default AppStackScreen;