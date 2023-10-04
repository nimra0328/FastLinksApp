import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MSSQL from 'react-native-mssql';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const config = {
      server: '182.180.171.46', //ip address of the mssql database
      username: 'NimraShah', //username to login to the database
      password: 'ShahNimra@321', //password to login to the database
      database: 'Master', //the name of the database to connect to
      port: 1433, //OPTIONAL, port of the database on the server
      timeout: 5, //OPTIONAL, login timeout for the server
    };

    try {
      await MSSQL.connect(config);

      const query = `SELECT Name FROM Sys.Databases WHERE LEFT(Name, 13) = '${phone}';`;
      const result = await MSSQL.executeQuery(query);
      console.log(result);

      if (result.length > 0) {
        const {Name} = result[0];
        const serializedResult = Name;
        await AsyncStorage.setItem('queryResult', serializedResult);
        console.log('Result stored in AsyncStorage:', serializedResult);

        // Close the connection to the first database
        await MSSQL.close();

        // Retrieve the stored result from AsyncStorage
        const retrievedResult = await AsyncStorage.getItem('queryResult');
        console.log('Stored Result:', retrievedResult);

        const config1 = {
          server: '182.180.171.46', //ip address of the mssql database
          username: 'NimraShah', //username to login to the database
          password: 'ShahNimra@321', //password to login to the database
          database: serializedResult,
          port: 1433, //OPTIONAL, port of the database on the server
          timeout: 5, //OPTIONAL, login timeout for the server
        };
        await MSSQL.connect(config1);

        const query1 = `Select * from PW where UN='Admin' And PW ='${password}';`;
        console.log('HERE is password Value', password);
        const result1 = await MSSQL.executeQuery(query1);
        console.log(result1);

        if (result1.length > 0) {  
          // Navigate to the next screen or perform any other actions
          navigation.navigate('HomeScreen');
          console.log('Login ,Welcome to Home Screen');
        } else {
          console.log('Incorrect password');
          Alert.alert('Login Failed', 'Incorrect password. Please try again.'); // Show incorrect password alert
        }
        // Close the connection to the second database
        await MSSQL.close();
      } else {
        console.log('Incorrect phone number');
        Alert.alert(
          'Login Failed',
          'Incorrect phone number. Please try again.',
        ); // Show incorrect phone number alert
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any error that occurred during the login process
    }
  };

  return (
    // <View style={styles.container}>
    //   <Text style={{color:'black',fontSize:18,fontWeight:'bold'}}>Login</Text>
    // <View style={{marginTop: 20}}>
    //   <TextInput
    //     style={styles.input}
    //     placeholder="Phone Number"
    //     placeholderTextColor={'grey'}
    //     keyboardType="text"
    //     value={phone}
    //     onChangeText={setPhone}
    //   />
    //   <TextInput
    //     style={styles.input}
    //     placeholder="Password"
    //     placeholderTextColor={'grey'}
    //     secureTextEntry
    //     value={password}
    //     onChangeText={setPassword}
    //   />
    // </View>

    // <TouchableOpacity
    //   style={{
    //     backgroundColor: 'black',
    //     width: 200,
    //     height: 40,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}
    //   onPress={handleLogin}>
    //   <Text style={{color: 'white', alignSelf: 'center'}}> Login</Text>
    // </TouchableOpacity>

    //   {/* <TouchableOpacity
    //     style={{
    //       backgroundColor: 'black',
    //       width: 200,
    //       height: 40,
    //       marginTop: 10,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}
    //     onPress={handleResult}>
    //     <Text style={{color: 'white', alignSelf: 'center'}}> Connect 1</Text>
    //   </TouchableOpacity> */}
    // </View>

    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ImageBackground
        source={require('../images/background.png')}
        style={{width: '100%', height: '100%'}}>
        <View style={{flex: 0.1}}></View>
        <ImageBackground
          source={require('../images/myCard.png')}
          style={{flex: 1, width: 375, height: 667, alignSelf: 'center'}}
          resizeMode="contain">
          <View style={{flex: 0.2}}>
            {/* <Text
              style={{
                color: 'white',
                position: 'absolute',
                paddingStart: 50,
                paddingTop: 35,
                paddingBottom: 35,
              }}>
              Sign Up
            </Text> */}
          </View>
        
          <View style={{flex: 1, marginHorizontal: 60,marginTop:20}}>
            <Text style={{color: 'black',fontSize:20,fontWeight:'800'}}>Login</Text>
    
            <View style={{marginTop: 40}}>
              <Text style={{color:'black',fontSize:14}}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={'grey'}
          keyboardType="text"
          value={phone}
          onChangeText={setPhone}
        />
            <Text style={{color:'black',fontSize:14,marginTop:30}}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'grey'}
          secureTextEntry
          keyboardType="numeric"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          width: '30%',
          height: 40,
          borderRadius:25,
          alignSelf:'flex-end',
          marginTop:30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleLogin}>
        <Text style={{color: 'white', alignSelf: 'center'}}> Login</Text>
      </TouchableOpacity>
     
          </View>

        
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    color: 'black',
    borderRadius:5,
    marginTop:10,
    backgroundColor:'gainsboro',
    paddingHorizontal: 10,
  },
  input1: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    color: 'black',
    borderRadius:5,
    marginTop:10,
    backgroundColor:'gainsboro',
    paddingHorizontal: 10,
  },
});

export default Login;


