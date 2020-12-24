import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Home from './home.jsx';
import VideosIndex from './VideosIndex.jsx';
import Profile from './profile.jsx'
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const buttonStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'skyblue',
  color: 'white',
  height: 150,
  width: 150
}

const pad = {
  padding: 20
}

const flex = {
  flex: 1,
  flexDirection: 'row'
}

const fullWidth = {
  width: 100
}

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  // return (
  //   <View style={styles.container}>
  //   <StatusBar style="auto" />
  // <NavigationContainer>
  //   <Stack.Navigator>
  //     <Stack.Screen
  //       name="Home"
  //       component={Marquee}
  //       options={{ title: 'Welcome' }}
  //     />
  //     <Stack.Screen name="Profile" component={Profile} />
  //   </Stack.Navigator>
  // </NavigationContainer>
  // </View>
  // );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
