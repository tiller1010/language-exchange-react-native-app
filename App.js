import React from 'react';
import 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigation from './Navigation.jsx';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9f74e4',
    accent: '#747de8'
  }

}

// Add a string method to convert times to AM/PM format
String.prototype.convertTo12HourTime = function(){
  // Should be called like: '21:00.convertTo12HourTime()'. '1/1/2000' is an arbitrary valid date.
  return new Date('1/1/2000 ' + this).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Navigation/>
    </PaperProvider>
  );
}
