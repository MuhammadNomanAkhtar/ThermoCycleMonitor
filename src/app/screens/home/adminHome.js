import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {Alert, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, FlatList, ScrollView, Platform} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import { RadialSlider } from 'react-native-radial-slider';
import RoseInput from '../../components/Elements/RoseInput';
import RoseButton from '../../components/Elements/RoseButton';
import moment from 'moment';
import { SignOut } from '../../../shared/firebase/FirebaseAuthentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { getUserAsyncData } from '../../../shared/asyncstorage/UserAsync';
// import ViewShot from 'react-native-view-shot';
import ViewShot, { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const {height, width} = Dimensions.get("window")

const AdminHome = (props) => {
    const navigation = useNavigation()
    const viewShotRef = useRef();
    const scrollViewRef = useRef();
    const flatListRef = useRef(null);
    const [registeredDevices, setRegisteredDevices] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [deviceId, setDeviceId] = useState('')
    const [temp, setTemp] = useState('')
    const [time, setTime] = useState('')
    const [maxDeviceId, setMaxDeviceId] = useState(-1)
    
    useEffect(() => {
        getUserAsyncData().then((res)=>{
         database()
          .ref(`/devices`)
          .on('value', snapshot => {
            console.log('Admin data: ', snapshot.val());
            let data = snapshot.val()
            if(data){
                const dataToDisplay = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                let ids = dataToDisplay.map(item => parseInt(item.id, 10));
                let maxId = Math.max(...ids);
                setRegisteredDevices(dataToDisplay)
                setMaxDeviceId(maxId)
                console.log(maxId,' Admin Converted data: ', dataToDisplay);
            }
          });
        })
    }, [props]);

    const capturePdf = async (data) => {
        // Convert the array of objects to HTML
        const htmlContent = `
          <html>
            <head>
              <style>
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: left;
                }
              </style>
            </head>
            <body>
              <h1>Report</h1>
              <table>
                <thead>
                  <tr>
                    ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${data.map(item => `
                    <tr>
       ${Object.values(item).map(value => `<td>${value}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const options = {
    html: htmlContent,
    fileName: 'report'+moment(new Date()).format(""),
    directory: 'Documents',
  };

  try {
    const pdf = await RNHTMLtoPDF.convert(options);
    console.log(pdf.filePath);

    // Optionally, move the PDF to the desired location using RNFS
    const path =
    Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath
    : RNFS.DownloadDirectoryPath;
    const newFilePath = `${path}/reports${moment(new Date()).format("")}.pdf`;
    await RNFS.moveFile(pdf.filePath, newFilePath);
    Alert.alert('', `Report Downloaded Successfully`
        , [
        {
          text: 'Ok',
          onPress: () => {
            FileViewer.open(newFilePath);
          },
        },
      ]
    );
    console.log('PDF moved to:', newFilePath);
  } catch (error) {
    console.error(error);
  }
};

// const handleSearch = () => {
//     const result = registeredDevices.filter(item => item.id.includes(deviceId) || item.temp.includes(temp) || item.time.includes(time));
//     alert(JSON.stringify(result))
//     setFilteredData(result);
// };
const handleSearch = () => {
    const result = registeredDevices.length>0 && registeredDevices?.filter(item => {
      const matchesDeviceId = deviceId ? item.id.includes(deviceId) : true;
      const matchesTemp = temp ? item.temp.toString().includes(temp) : true;
      const matchesTime = time ? item.time.toString().includes(time) : true;
      return matchesDeviceId && matchesTemp && matchesTime;
    });
    setFilteredData(result);
  };
  const handleReset = () => {
    setFilteredData([])
    setTime('')
    setTemp('')
    setDeviceId('')
  }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text category='h5' style={styles.username}>Welcome back!</Text>
                <Text category='s1' style={styles.role}>Manage your Devices</Text>
            </View>
            <TouchableOpacity onPress={() => {
                SignOut()
                navigation.navigate("Login")
            }}>
                <Icon
                    style={styles.logout}
                    fill={"#fff"}
                    name='log-out-outline'
                />
            </TouchableOpacity>
        </View>
        <View style={styles.body}>
            <View style={styles.bar}>
                <RoseInput
                    placeholder={"Time"}
                    value={time}
                    width={'40%'}
                    onChangeText={nextValue => setTime(nextValue)}
                />
                <RoseInput
                    placeholder={"Temp"}
                    value={temp}
                    width={'40%'}
                    onChangeText={nextValue => setTemp(nextValue)}
                />
            </View>
            <View style={styles.bar}>
                <RoseInput
                    placeholder={"Device Id"}
                    value={deviceId}
                    width={'40%'}
                    onChangeText={nextValue => setDeviceId(nextValue)}
                />
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => handleSearch()}>
                    <Icon name={'search'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => handleReset()}>
                    <Icon name={'refresh'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => capturePdf(registeredDevices)}>
                    <Icon name={'printer-outline'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.speedometer}>
            <Text category='h5' style={{marginBottom:10,}}>Registered Devices</Text>
            {registeredDevices.length==0?
                <Text category='s1' style={{alignSelf:'center'}}>No Registered Device Found</Text>
                :
                <FlatList
                    data={filteredData.length>0? filteredData : registeredDevices}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={{backgroundColor:'#f8ad9d', padding:3, borderRadius:3}}>
                                    <Text category='s1'>Device Id: {item.id}</Text>
                                </View>
                                <View style={{backgroundColor:'#B0E0E6', padding:3,borderRadius:3}}>
                                    <Text category='s1'>Temp: {item.temp}°F</Text>
                                </View>
                                <View style={{backgroundColor:'#FFE5B4', padding:3,borderRadius:3}}>
                                    <Text category='s1'>Time: {item.time}Min</Text>
                                </View>
                            </View>
                            
                            {/* <Text category='s1'>Email: {item.email}</Text> */}
                            <View style={{
                                // backgroundColor:'#FFC299', 
                                padding:3, marginBottom:3}}>
                                <Text category='s1'>Technician: {item.technician}</Text>
                                
                            </View>
                            <View style={{
                                // backgroundColor:'#F2FFE5', 
                            padding:3, marginBottom:3}}>
                                <Text category='s1'>Clinical Device: {item.clinical_device}
                                </Text>
                            </View>
                            <View style={{
                                // backgroundColor:'#ADEBD6', 
                                padding:3, marginBottom:3}}>
                                <Text category='s1'>Updated At: {item.cycle_datetime}</Text>
                                
                            </View>
                        </View>
                    )}
                    keyExtractor={() => Math.random().toString()}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={7}
                />
            }
            </View>
            <View style={styles.buttons}>
                <RoseButton
                    label="Add User"
                    onPress={() => navigation.navigate("AddUser", {nextDeviceId: maxDeviceId != -1? maxDeviceId+1 : 1})}
                    // width={190}
                />
            </View>
        </View>
    </SafeAreaView>
  );
};
export default AdminHome;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.primary
    },
    header:{
        height:height*10/100,
        width:width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        paddingBottom:20,
    },
    username:{
        color:'#fff'
    },
    role:{
        color:'#000',
        marginTop:5,
        fontWeight:'bold',
        fontSize:16
    },
    logout:{
        height:30,
        width:30
    },
    body:{
        height:height*90/100,
        width:width,
        backgroundColor:"#fff",
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        padding:20,
    },
    bar:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        height:'8%',
    },
    baricon:{
        borderRadius: 5,
        justifyContent: 'center',
        alignItems:'center',
        height: 40,
        width: 40,
        backgroundColor: Colors.primary,
    },
    card:{
        backgroundColor:'#fff',
        padding:5,
        borderWidth:0.5,
        borderColor:'grey',
        borderRadius:3,
        marginBottom:5,
        elevation:10,
        zIndex:1
    },
    cardHeader:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:3
    },


    speedometer:{
        paddingTop:10,
        height:'68%',
    },
    meter:{
        alignItems:'center',
        width:'48%',
    },
    meterlabel:{
        marginTop:20,
    },
    device:{
        height:'25%',
    },
    devicetitle:{
        color:"#AE0000",
        marginTop:20
    },
    devicename:{
        color:"#000",
    },
    devicetime:{
        alignSelf:'flex-end',
        marginTop:5
    },
    buttons:{
        flexDirection:'row',
        alignSelf:'flex-end',
        alignItems:'center',
        // marginTop:30,
        height:'10%',
    }
});