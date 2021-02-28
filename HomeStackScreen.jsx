import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home.jsx';
import VideosIndex from './VideosIndex.jsx';
import VideosAdd from './VideosAdd.jsx';
import Level from './Level.jsx';
import Topic from './Topic.jsx';

const Stack = createStackNavigator();

class HomeStackScreen extends React.Component {

    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen
                    name="Home"
                    component={Home}
                  />
                  <Stack.Screen
                    name="VideosIndex"
                    component={VideosIndex}
                  />
                  <Stack.Screen
                    name="VideosAdd"
                    component={VideosAdd}
                  />
                  <Stack.Screen
                    name="Level"
                    component={Level}
                  />
                  <Stack.Screen
                    name="Topic"
                    component={Topic}
                  />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default HomeStackScreen;