// import { View, Text } from 'react-native'
// import React from 'react'
// import Login from './src/screens/Login'

// const App = () => {
//   return (
//     <View style={{flex:1}}>
//       <Login/>
//     </View>
//   )
// }

// export default App



import { View, Text } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import TrailBalance from './src/screens/TrailBalance';
import Ledger from './src/screens/Ledger';
import MyWeatherApp from './src/screens/MyWeatherApp';







const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{
    headerShown: false
  }}>

<Stack.Screen name="HomeScreen" component={HomeScreen} />
<Stack.Screen name="SplashScreen" component={SplashScreen}  />
    
    <Stack.Screen name="Ledger" component={Ledger} />
   

    {/* <Stack.Screen name="MyDatePicker" component={MyDatePicker} /> */}
 
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login'}}
        />
       
      
        <Stack.Screen name="TrailBalance" component={TrailBalance} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App


