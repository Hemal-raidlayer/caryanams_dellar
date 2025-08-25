import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/Screens/LoginScreen/LoginScreen';
import SplashScreen from './src/Screens/SplashScreen/SplashScreen';
import Dashboard from './src/Screens/Dashboard/Dashboard';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/Component/ToastConfig'
import Loader from './src/Component/Loader'

const Stack = createStackNavigator();
export const loaderRef = React.createRef();


const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Toast must be rendered once at the root */}
      <Toast  config={ToastConfig}/>
      <Loader ref={loaderRef}/>
    </>
  );
};

export default App;
