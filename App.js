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

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Navigation/>
    </PaperProvider>
  );
}
