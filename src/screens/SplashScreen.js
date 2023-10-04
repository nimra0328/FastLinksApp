import {
  View,
  StyleSheet,
  Text,
  Image,
  Touchable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';

const SplashScreen = ({navigation}) => {
    setTimeout(() => {
      navigation.replace('Login')
    }, 3600);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../images/background.png')} style={{width:'100%',height:'100%'}}> 
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          paddingBottom:50,
          alignItems: 'center',

   
        }}>
        <Text style={{fontSize:37,color:'white'}}> Fast-Links</Text>
        <Text style={{fontSize:14,color:'white'}}> Expertise. Commitment. Value.</Text>
      </View>

      {/* <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 30,

        }}>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}
          activeOpacity={0.7}
          style={{
            width: '90%',
            height: 50,
            backgroundColor: 'black',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white',fontSize:16}}>Log In</Text>
        </TouchableOpacity>

       
            </View> */}

      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#4cb79f',
    flex: 2,
    justifyContent: 'flex-end',
    // alignItems:'center',
  },
  bgImage: {
    width: '100%',
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textContainer: {
    position: 'absolute',
    backgroundColor: '#4CB79F',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  txt: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    color: '#1a404b',
  },
  txt1: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    color: '#1a404b',
  },
});
