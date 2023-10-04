import { View, Text ,TouchableOpacity,StyleSheet,ImageBackground} from 'react-native'
import React,{useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MSSQL from 'react-native-mssql';
import { useNavigation } from '@react-navigation/native';



const HomeScreen = () => {

    const [flatlistData, setFlatlistData] = useState([]);
    const [ledgerList, setLedgerList] = useState([]);
    


    const navigation = useNavigation();

    const showTrailBalance = async () => {

      
        try {
         
            // Retrieve the stored result from AsyncStorage
            const serializedResult = await AsyncStorage.getItem('queryResult');
            console.log('Stored Result:', serializedResult);
            const config1 = {
              server: '182.180.171.46', //ip address of the mssql database
              username: 'NimraShah', //username to login to the database
              password: 'ShahNimra@321', //password to login to the database
              database: serializedResult,
              port: 1433, //OPTIONAL, port of the database on the server
              timeout: 5, //OPTIONAL, login timeout for the server
            };
            await MSSQL.connect(config1);
      
            const query1 = `SELECT   AccTbl.NameE,AccTbl.AccCode, Cash.Type, Cash.SM, SUM(Cash.Dr) - SUM(Cash.Cr) AS AMT
            FROM Cash,AccTbl Where AccTbl.AccCode=Cash.AccCode
            GROUP BY AccTbl.NameE,AccTbl.AccCode, Cash.Type, Cash.SM`;

            // console.log('HERE is password Value', password);
            const result1 = await MSSQL.executeQuery(query1);
            console.log(result1);
    
      // Update the state variable with the data from result1
         setFlatlistData(result1);

         // Navigate to the next screen, passing the flatlistData as a parameter
         navigation.navigate('TrailBalance', { flatlistData: result1 });

            // Close the connection to the second database
            await MSSQL.close();
          
        } catch (error) {
          console.error('Error:', error);
          // Handle any error that occurred during the login process
          // ...
        }
      };



      const showLedger = async () => {

      
        try {
         
            // Retrieve the stored result from AsyncStorage
            const serializedResult = await AsyncStorage.getItem('queryResult');
            console.log('Stored Result:', serializedResult);
            const config1 = {
              server: '182.180.171.46', //ip address of the mssql database
              username: 'NimraShah', //username to login to the database
              password: 'ShahNimra@321', //password to login to the database
              database: serializedResult,
              port: 1433, //OPTIONAL, port of the database on the server
              timeout: 5, //OPTIONAL, login timeout for the server
            };
            await MSSQL.connect(config1);
      
            const query1 = `SELECT NameE,AccCode from AccTbl`;

            // console.log('HERE is password Value', password);
            const LedgerResult = await MSSQL.executeQuery(query1);
            console.log(LedgerResult);
    
      // Update the state variable with the data from result1
         setLedgerList(LedgerResult);



      
         // Navigate to the next screen, passing the flatlistData as a parameter
         navigation.navigate('Ledger', {LedgerResult});
    

            // Close the connection to the second database
            await MSSQL.close();
          
        } catch (error) {
          console.error('Error:', error);
          // Handle any error that occurred during the login process
          // ...
        }
      };






  return (
    // <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    

    // <View style={{}}>
    // <TouchableOpacity onPress={showTrailBalance}
    //     style={{
    //       backgroundColor: 'black',
    //       width: 200,
    //       height: 40,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}
    //     >
    //     <Text style={{color: 'white', alignSelf: 'center'}}> Trial Balance</Text>
    //   </TouchableOpacity>

    //   <TouchableOpacity onPress={showLedger}
    //     style={{
    //       backgroundColor: 'black',
    //       width: 200,
    //       height: 40,
    //       marginTop:20,
    //       justifyContent: 'center',
    //     }}
    //     >
    //     <Text style={{color: 'white', alignSelf: 'center'}}> Ledger</Text>
    //   </TouchableOpacity>

    // </View>
    
    // </View>

    <View style={styles.container}>
     
     
      <View
        style={{
          flex: 2,
          justifyContent: 'flex-end',
          paddingBottom:50,
          alignItems: 'center',

   
        }}>
        <Text style={{fontSize:37,color:'black'}}> FAST-LINKS</Text>
        <Text style={{fontSize:14,color:'black'}}> Expertise.Commitment.Value</Text>
      </View>

      <View
        style={{
          flex: 2,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 30,

        }}>
        <TouchableOpacity onPress={showTrailBalance}
          activeOpacity={0.7}
          style={{
            width: '90%',
            height: 50,
            backgroundColor: 'black',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white',fontSize:16}}>Trail Balance</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={showLedger}
          activeOpacity={0.7}
          style={{
            width: '90%',
            height: 50,
            marginTop:20,
            backgroundColor: 'black',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white',fontSize:16}}>Ledger</Text>
        </TouchableOpacity>

       
       

      </View>
    
    </View>
  )
}

export default HomeScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
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