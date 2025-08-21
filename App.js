import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from'./src/Screens/LoginScreen/LoginScreen'
import SplashScreen from './src/Screens/SplashScreen/SplashScreen'
import Dashboard from './src/Screens/Dashboard/Dashboard'


const Stack = createStackNavigator();

const  App =()=> {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
