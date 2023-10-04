
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MSSQL from 'react-native-mssql';
import { DarkTheme } from '@react-navigation/native';

const Ledger = ({ route, navigation }) => {
  const { LedgerResult } = route.params;

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');
  const [reverseStartDate, setReverseStartDate] = useState('');
  const [reverseEndDate, setReverseEndDate] = useState('');


  const [selectedAccCode, setSelectedAccCode] = useState('');

  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [flatlistData, setFlatlistData] = useState([]);
  const [openingBalance, setOpeningBalance] = useState([]);

  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showFlatListData, setShowFlatlistData] = useState(true);

  const [showOBData, setShowOBData] = useState(false);
  const [showFlatlistHeading, setShowFlatlistHeading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    filterData();
  }, [searchText]);


  




  const formatDateForDisplay = (dateString) => {
    const parts = dateString.split('/');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${month}/${day}/${year}`;
  };
  



  const handleReverseStartDate = (date) => {

    const reversedStartDate = formatDateForUser(date); 
    setReverseStartDate(reversedStartDate);
    console.log("this is Date Recieving",date)
    console.log('This is Reversed date for frontend',reversedStartDate)

    const formattedStartDate = formatDateForDisplay(date);
    setStartDate(formattedStartDate);
    console.log("this is Date Recieving",date)
    console.log('This is Reversed date for Backend',formattedStartDate)
   
   
  };


  const handleReverseEndDate = (date) => {

    const reversedEndDate = formatDateForUser(date); 
    setReverseEndDate(reversedEndDate);
    console.log("this is Date Recieving",date)
    console.log('This is Reversed date for frontend',reversedEndDate)
    
    const formattedDate = formatDateForDisplay(date);
    setEndDate(formattedDate);
    console.log("this is Date Recieving",date)
    console.log('This is Reversed date for backend',formattedDate)
   
  };



  const formatDateForUser = (dateString) => {
    const parts = dateString.split('/');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  };




  
  

  const filterData = () => {
    if (searchText !== '') {
      const filtered = LedgerResult.filter(
        (item) =>
          item.AccCode.toLowerCase().includes(searchText.toLowerCase()) ||
          item.NameE.toLowerCase().includes(searchText.toLowerCase())
      ).map((filteredItem) => ({
        ...filteredItem,
        buttonColor: 'gainsboro', // Set initial button color to gray for filtered items
      }));
      setFilteredData(filtered);
      setShowFlatlistHeading(false);
      setShowDatePicker1(false);
      setShowDatePicker2(false);
      setShowOBData(false);
      setShowFlatlistData(false);
      setShowList(true)
    } else {
      setFilteredData(LedgerResult); // Set filtered data to the original LedgerResult when searchText is empty
      setShowList(false)
    }
  };
  


  const handleItemSelect = (item) => {
    console.log('Selected Item Name:', item.NameE);
    console.log('Selected Item Account:', item.AccCode);
  
    setSearchText(item.NameE);
    setSelectedAccCode(item.AccCode);
    setShowList(false);
    setErrorMessage('');

    const updatedData = filteredData.map((dataItem) => {
      if (dataItem.AccCode === item.AccCode) {
        return {
          ...dataItem,
          buttonColor: dataItem.buttonColor === 'gainsboro' ? 'black' : 'gainsboro',
        };
      }
      return dataItem;
    });
  
    setFilteredData(updatedData);
  };
  


// // Access the OB value from openingBalance
// const obValue = openingBalance[0]?.OB;

const obValue = openingBalance.length > 0 ? openingBalance[0].OB : 0;

let cumulativeSum = obValue;

const updatedData = flatlistData.map(item => {
  const balance = cumulativeSum + item.Dr - item.Cr;
  cumulativeSum = balance;
  return { ...item , balance};
  
  
});


  const showLedgeronDate = async item => {
    try {
      if(searchText !== ''){
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

 

//  const openingBalanceQuery = `Select Sum(Dr)-Sum(Cr) as OB from Cash where Type='--' AND Date<'${startDate}' AND AccCode='${selectedAccCode}'`;
//  const queryResult = await MSSQL.executeQuery(openingBalanceQuery);
//  console.log('Hi i am Opening Balance', queryResult);
//  setOpeningBalance(queryResult);


const openingBalanceQuery = `Select Sum(Dr)-Sum(Cr) as OB from Cash where Type='--' AND Date<'${startDate}' AND AccCode='${selectedAccCode}'`;

try {
  const queryResult = await MSSQL.executeQuery(openingBalanceQuery);

  // Check if queryResult is an empty array containing a single empty object
  if (queryResult.length === 1 && Object.keys(queryResult[0]).length === 0) {
    // If it's [{}], set obValue to 0
    var obValue = 0;
  } else {
    // If it's not [{}], extract the OB value
    var obValue = queryResult[0].OB;
  }

  console.log('Opening Balance from Query', obValue);

  // Continue with your further queries and ledger processing using obValue
  // ...
} catch (error) {
  console.error('Error fetching opening balance:', error);
  // Handle the error as needed
}



 const query = `SELECT * FROM Cash WHERE Branch='1' AND Type='--' AND Date>='${startDate}' AND Date<='${endDate}' AND AccCode='${selectedAccCode}' ORDER BY Date, VT, VNo, Sr`;
//  const query = `SELECT * FROM Cash WHERE Branch='--' AND Type='--' AND Date>='${startDate}' AND Date<='${endDate}' AND AccCode='${selectedAccCode}' ORDER BY Date, VT, VNo, Sr`;

 // const query = `SELECT * FROM Cash WHERE Branch='--' AND Type='--' AND Date>=${selectedDate} AND Date<=${endDate} AND AccCode='${selectedAccCode}' ORDER BY Date, VT, VNo, Sr`;
 const result = await MSSQL.executeQuery(query);
 console.log('Hi i am ledger Result', result);
 // Update the state variable with the data from result1
 setFlatlistData(result);
 setShowList(false)
 setShowDatePicker1(false)
 setShowDatePicker2(false);
 setShowOBData(true)
  setShowFlatlistData(true);
  setShowFlatlistHeading(true)
  
  await MSSQL.close();

      }

     else{
      console.log('Please Select Acccount 1st')
      setErrorMessage('Please search and select an account.');
     }
      // Navigate to the next screen, passing the flatlistData as a parameter
      // navigation.navigate('LedgerItemList', {
      //   flatlistData: result,
      //   openingBalance: queryResult,
      //   startDate: startDate,
      //   endDate: endDate,
      // });
      // Close the connection to the second database

      
    } catch (error) {
      // Handle any error that occurred during the login process
      console.error('Error:', error);
    }
  };



  const renderItem = ({ item }) => (
    
     <View>
  <TouchableOpacity
      onPress={() => handleItemSelect(item)}
      style={[
        styles.itemContainer1,
        { backgroundColor: item.buttonColor ? item.buttonColor : 'gainsboro' },
      ]}
    >
      <Text style={styles.item}>{item.NameE}</Text>
      <Text style={styles.item}>{item.AccCode}</Text>
    </TouchableOpacity>
     </View>
  
  );
//Flatlist Ledger

  const renderItem1 = ({ item ,index}) => (
    <View 
    style={[
      styles.itemContainer,
      { backgroundColor: index % 2 === 0 ? 'white' : 'gainsboro' },
    ]}
    >
        <Text  style={{width:'18%',fontSize:9,color:'black',paddingStart:5}}>{item.Date.split(' ')[0].split('-').reverse().join('-')}</Text>
        {/* <Text  style={{width:'25%',fontSize:14,color:'black'}}>{item.Date.split(' ')[0]}</Text> */}
        <Text  style={{width:'8%',fontSize:9,color:'black'}}>{item.VNo}</Text>
        <Text style={{width:'8%',fontSize:8,color:'black'}}>{item.VT}</Text>
        <Text style={{width:'20%',fontSize:8,color:'black'}}>{item.Remarks}</Text>
        <Text style={{width:'12%',fontSize:8,color:'black',textAlign:'right'}}>{item.Dr}</Text>
        <Text style={{width:'12%',textAlign:'right',fontSize:8,color:'black',paddingRight:5}}>{item.Cr}</Text>
        <Text style={{width:'12%',textAlign:'right',fontSize:8,color:'black',paddingEnd:10}}>{item.balance}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Search Ledger</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Search...."
          placeholderTextColor={'black'}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      <View style={styles.datePickerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Start date"
          placeholderTextColor={'black'}
          value={reverseStartDate}
          onFocus={() => {
            setShowDatePicker1(true);
            setShowDatePicker2(false);
            setShowList(false);
          
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="End date"
          placeholderTextColor={'black'}
          value={reverseEndDate}
          onFocus={() => {
            setShowDatePicker1(false);
            setShowDatePicker2(true);
            setShowList(false)
          }}
        />

        <TouchableOpacity
          onPress={showLedgeronDate}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

    
       

      {showOBData && (
  <View style={{padding:10,backgroundColor:'gainsboro',marginTop:10,
  flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
        <Text style={{fontSize:16,color:'black'}} >Here is Your Opening Balance</Text>
        <Text style={{color:'black',fontSize:14,fontWeight:'bold',}}>{obValue}</Text>

    </View>
)}




{showFlatlistHeading &&(
 <View style={{flexDirection:'row',marginHorizontal:10,marginTop:10,marginBottom:10}}>
 <Text style={{width:'18%',fontSize:11,color:'black',fontWeight:'bold'}}>Date </Text>
         <Text style={{width:'8%',fontSize:11,color:'black',fontWeight:'bold'}}>VNo </Text>
     <Text style={{width:'9%',marginStart:5,fontSize:11,color:'black',fontWeight:'bold'}}>VT </Text>
     <Text style={{width:'23%',fontSize:11,color:'black',paddingStart:3,fontWeight:'bold'}}>Remarks</Text>
     <Text  style={{width:'15%',fontSize:11,color:'black',textAlign:'right',fontWeight:'bold'}}>Debit </Text>
     <Text  style={{width:'13%',fontSize:11,color:'black',textAlign:'right',fontWeight:'bold'}}>Credit </Text>
     <Text  style={{width:'14%',fontSize:11,color:'black',textAlign:'right',fontWeight:'bold'}}>Balance </Text>
</View>
)}



      
      
{showFlatListData && (
  
 <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={updatedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem1}
        />
       
      )}

      {showDatePicker1 && (
        <View style={styles.datePickerOverlay}>
          {/* <Text style={styles.datePickerTitle}>Select Start Date</Text> */}
          <DatePicker
             options={{
              backgroundColor: 'white',
              textHeaderColor: 'black',
              textDefaultColor: 'black',
              selectedTextColor: '#fff',
              mainColor: 'black',
              textSecondaryColor: 'black',
              borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
            date={startDate}
            format="MM/DD/YY"
            mode='calendar'
            onDateChange={handleReverseStartDate}
            style={styles.datePicker}
          />
        </View>
      )}

      {showDatePicker2 && (
        <View style={styles.datePickerOverlay}>
          {/* <Text style={styles.datePickerTitle}>Select End Date</Text> */}
          <DatePicker
             options={{
              backgroundColor: 'white',
              textHeaderColor: 'black',
              textDefaultColor: 'black',
              selectedTextColor: '#fff',
              mainColor: 'black',
              textSecondaryColor: 'black',
              borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
            date={endDate}
            format="MM/DD/YY"
            mode='calendar'

            onDateChange={handleReverseEndDate}
            style={styles.datePicker}
          />
        </View>
      )}



{showList && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={filteredData}
          keyExtractor={(item) => item.AccCode}
          renderItem={renderItem}
        />
      )}



   



          </View>
  );
};

export default Ledger;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  header: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'black',
    padding: 15,
    marginBottom: 20,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    marginTop: 10,
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal:20
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 5,
    width: 80,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  submitButtonText: {
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 40,

  },
  itemContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
marginTop:5,
marginBottom:5,
    height: 40,

  },
  item: {
    color: 'black',
    fontSize: 11,
    padding: 5,
  },
  datePickerOverlay: {
    marginTop: 10,
  },
  datePickerTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  datePicker: {
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    fontSize:12,
    textAlign:'right',
    marginRight:20
  },
});
