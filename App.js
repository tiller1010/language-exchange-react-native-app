import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Home from './Home.jsx';
import VideosIndex from './VideosIndex.jsx';
import VideosAdd from './VideosAdd.jsx';
import Level from './Level.jsx';
import Topic from './Topic.jsx';
import Profile from './profile.jsx'
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow'
  }

}

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
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
    </PaperProvider>
  );
}
