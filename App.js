import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import GameScreen from './src/screens/GameScreen';
import MainMenu from './src/screens/MainMenu';
import LevelSelection from './src/screens/LevelSelection';


const Stack = createStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='MainMenu'>
        <Stack.Screen name='MainMenu' component={MainMenu} />
        <Stack.Screen name='LevelSelection' component={LevelSelection} />
        <Stack.Screen 
          name='GameScreen' 
          component={GameScreen}
          // options={{ headerLeft: () => null }}
          options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )

  return <GameScreen />;
}