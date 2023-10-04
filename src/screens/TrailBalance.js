import { View, Text ,FlatList,StyleSheet, TouchableOpacity} from 'react-native'
import React,{useEffect,useState} from 'react'


const TrailBalance = ({route,navigation}) => {

    const { flatlistData } = route.params;



// Initialize state variables for filtered and sorted data
const [filteredAndSortedData, setFilteredAndSortedData] = useState([]);

useEffect(() => {
  // Filter the data array to exclude items with amount zero
  const filteredData = flatlistData.filter(item => item.AMT !== 0);

  // Sort the filtered data array by nameE in alphabetical order
  const sortedData = filteredData.sort((a, b) => a.NameE.localeCompare(b.NameE));

  // Set the filtered and sorted data to state
  setFilteredAndSortedData(sortedData);
}, [flatlistData]);




// // Filter the data array to exclude items with amount zero
// const filteredData = flatlistData.filter(item => item.AMT !== 0);


// Initialize variables to hold the total debit and credit amounts
let totalDebit = 0;
let totalCredit = 0;

// Iterate over the data in the FlatList
flatlistData.forEach(item => {
  if (item.AMT >= 0) {
    totalDebit += item.AMT; // Add the amount to the total debit
  } else {
    totalCredit += Math.abs(item.AMT); // Add the absolute amount to the total credit
  }
});

// Display the total debit and credit amounts
console.log('Total Debit:', totalDebit);
console.log('Total Credit:', totalCredit);


const renderItem = ({ item ,index}) => (
  <View 
  style={[
    styles.itemContainer,
    { backgroundColor: index % 2 === 0 ? 'white' : 'gainsboro' },
  ]}
  >
    <Text style={styles.item}>{item.NameE}</Text>
    <Text style={styles.item1}>{item.Type}</Text>

    {item.AMT >= 0 ? (
      <Text style={styles.item1}>{item.AMT}</Text>
      
    ) : (
      <Text style={styles.item1}>-</Text>
    )}

{item.AMT < 0 ? (
      <Text style={styles.item2}>{-item.AMT}</Text>
    ) : (
      <Text style={styles.item2}>-</Text>
    )}
   
  </View>
);


  return (

  <View style={{flex:1,backgroundColor:'white'}}>
  
    {/* <ImageBackground source={require('../images/background.png')} style={{width:'100%',height:'100%'}}> */}
    <View style={{flex:0.2,flexDirection:'row',
    justifyContent:'space-between',backgroundColor:'black',alignItems:'center'}}>
      <View style={{flexDirection:'row'}}>
      <Text style={styles.header}>Name</Text>
      <Text style={styles.header1}>Type</Text>
    </View>
      <View style={{flexDirection:'row',
      width:'40%',justifyContent:'space-between',paddingEnd:20}}>
    
      <Text style={styles.header11}>Debit</Text>
      <Text style={styles.header2}>Credit</Text>
      </View>
     

    </View>
      <View style={{flex:2}}>
      <FlatList
        data={filteredAndSortedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
      <View style={{flexDirection:'row',marginTop:10,}}>
      <View style={{backgroundColor:'black',width:'50%',height:40,
      marginBottom:10,alignItems:'flex-start',justifyContent:'center',paddingStart:10}}>
        <Text style={{color:'white',fontSize:14,fontWeight:'bold'}}>Total</Text>
      </View>


      <View style={{backgroundColor:'gainsboro',width:'25%',marginBottom:10,alignItems:'flex-end',paddingEnd:5,justifyContent:'center'
     }}>
        <Text style={{color:'black',fontSize:11,fontWeight:'bold',paddingStart:10,}}>{totalDebit}</Text>
      
      </View>

      <View style={{backgroundColor:'gainsboro',width:'25%',marginBottom:10,alignItems:'flex-end',paddingEnd:10,justifyContent:'center'
     }}>
      
        <Text style={{color:'black',fontSize:11,fontWeight:'bold',paddingStart:20}}>{totalCredit}</Text>
      </View>


      </View>
<View style={{justifyContent:'flex-end',marginBottom:10,marginEnd:20,alignItems:'flex-end'}}>
<TouchableOpacity onPress={()=>navigation.goBack()}
          activeOpacity={0.7}
          style={{
            width: '30%',
            height: 40,
            backgroundColor: 'black',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white',fontSize:16}}>Go Back</Text>
        </TouchableOpacity>
</View>
     
      {/* </ImageBackground> */}
    </View>

    
  )
}

export default TrailBalance


const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    paddingStart:10,
    width:130,
    color:'white'
  },
  header1: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    paddingStart:10,
  
    width:80,
    textAlign:'right',
    color:'white'

  },
  header11: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    paddingStart:10,
  
    width:60,
    textAlign:'right',
    color:'white'

  },
  header2: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
   
   textAlign:'right',
    width:90,
    paddingRight:10,
    color:'white'

  },
  itemContainer: {
    paddingStart:10,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:40,
  },
  item: {
    fontSize:10,
    width:'32%',
    color:'black',
    fontWeight:'bold',

    
    
  },
  item1: {
    
  
    width:'17%',
    fontWeight:'bold',
    fontSize:10,
    textAlign:'right',

    color:'black'    
  },
  item2: {
    textAlign:'right',
   marginEnd:10,
    width:'15%',
    fontWeight:'bold',
    fontSize:10,
    marginStart:10,
    color:'black'    
  },
});


