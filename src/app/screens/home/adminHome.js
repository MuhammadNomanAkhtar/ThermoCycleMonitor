import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {Alert, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, FlatList} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import { RadialSlider } from 'react-native-radial-slider';
import RoseInput from '../../components/Elements/RoseInput';
import RoseButton from '../../components/Elements/RoseButton';
import moment from 'moment';
import { SignOut } from '../../../shared/firebase/FirebaseAuthentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { getUserAsyncData } from '../../../shared/asyncstorage/UserAsync';
const {height, width} = Dimensions.get("window")

const AdminHome = (props) => {
    const navigation = useNavigation()
    const [registeredDevices, setRegisteredDevices] = useState([])
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
                    // value={headerSearch}
                    width={'40%'}
                    // onChangeText={nextValue => setHeaderSearch(nextValue)}
                />
                <RoseInput
                    placeholder={"Temp"}
                    // value={headerSearch}
                    width={'40%'}
                    // onChangeText={nextValue => setHeaderSearch(nextValue)}
                />
            </View>
            <View style={styles.bar}>
                <RoseInput
                    placeholder={"Device"}
                    // value={headerSearch}
                    width={'40%'}
                    // onChangeText={nextValue => setHeaderSearch(nextValue)}
                />
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => Alert.alert("Called")}>
                    <Icon name={'search'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => Alert.alert("Called")}>
                    <Icon name={'refresh'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => Alert.alert("Called")}>
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
                    data={registeredDevices}
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
        marginTop:5
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
        padding:20
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
        height:'60%',
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
        marginTop:20,
    }
});