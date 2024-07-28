import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {Alert, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import { RadialSlider } from 'react-native-radial-slider';
import RoseIcon from '../../components/Elements/RoseIcon';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import moment from 'moment';
import { SignOut } from '../../../shared/firebase/FirebaseAuthentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { getUserAsyncData } from '../../../shared/asyncstorage/UserAsync';
const {height, width} = Dimensions.get("window")

const Home = (props) => {
    const navigation = useNavigation()
    const [clinicalDevice, setClinicalDevice] = useState("")
    const [cycleDateTime, setCycleDateTime] = useState("")
    const [facilityCenter, setFacilityCenter] = useState("")
    const [technician, setTechnician] = useState("")
    const [temperature, setTemperature] = useState(0)
    const [cycleTime, setCycleTime] = useState(0)
    
    useEffect(() => {
        // setLoading(true)
        let data = props?.route?.params?.data
        if(data){
            setClinicalDevice(data?.clinical_device)
            setCycleDateTime(moment().utc(data?.cycle_datetime).local().format("DD/MM/YYYY HH:mm"))
            setFacilityCenter(data?.facility)
            setTechnician(data?.technician)
            setTemperature(data?.temp)
            setCycleTime(data?.time)
        }
    },[])
    
    useEffect(() => {
        getUserAsyncData().then((res)=>{
        // const onValueChange =
         database()
          .ref(`/devices/${res}`)
          .on('value', snapshot => {
            // console.log('User data: ', snapshot.val());
            let data = snapshot.val()
            if(data){
            setClinicalDevice(data?.clinical_device)
            setCycleDateTime(moment().utc(data?.cycle_datetime).local().format("DD/MM/YYYY HH:mm"))
            if(data?.hasOwnProperty("facility"))
            setFacilityCenter(data?.facility)
            if(data?.hasOwnProperty("technician"))
            setTechnician(data?.technician)
            setTemperature(data?.temp)
            setCycleTime(data?.time)}
          });
        })
    // onValueChange()
        // Stop listening for updates when no longer required
        // return () => database().ref(`/devices/${props?.route?.params?.deviceId}`).off('value', onValueChange);
    }, [props]);
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text category='h5' style={styles.username}>{technician}</Text>
                <Text category='s1' style={styles.role}>{facilityCenter}</Text>
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
                    disabled={true}
                    // value={headerSearch}
                    width={'40%'}
                    // onChangeText={nextValue => setHeaderSearch(nextValue)}
                />
                <RoseInput
                    placeholder={"Temp"}
                    disabled={true}
                    // value={headerSearch}
                    width={'40%'}
                    // onChangeText={nextValue => setHeaderSearch(nextValue)}
                />
            </View>
            <View style={styles.bar}>
                <RoseInput
                    placeholder={"Device"}
                    disabled={true}
                    // value={headerSearch}
                    width={'40%'}
                    // onChangeText={nextValue => setHeaderSearch(nextValue)}
                />
                <TouchableOpacity 
                    style= {styles.baricon}
                    disabled={true}
                    onPress={() => Alert.alert("Called")}>
                    <Icon name={'search'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    style= {styles.baricon}
                    disabled={true}
                    onPress={() => Alert.alert("Called")}>
                    <Icon name={'refresh'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
                <TouchableOpacity 
                    style= {styles.baricon}
                    disabled={true}
                    onPress={() => Alert.alert("Called")}>
                    <Icon name={'printer-outline'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
            </View>
            <Divider style={styles.divider}/>
            <View style={styles.speedometer}>
                <View style={styles.meter}>
                    <RadialSlider
                        variant={'speedometer-marker'}
                        value={cycleTime}
                        min={0}
                        max={60}
                        radius={50}
                        unit='Min'
                        markerCircleColor={""}
                        markerCircleSize={15}
                        // isHideTailText={true}
                        // sliderTrackColor={Colors.primary}
                        // linearGradient={[ { offset: '0%', color:"#00DCDC" }, { offset: '100%', color: Colors.primary }]}
                        // onChange={setSpeed}
                    />
                    <Text category='s1' style={styles.meterlabel}>Cycle Time</Text>
                </View>
                <View style={styles.meter}>
                    <RadialSlider
                        variant={'speedometer-marker'}
                        value={temperature}
                        min={0}
                        max={500}
                        radius={50}
                        unit='°F'
                        markerCircleColor={""}
                        markerCircleSize={15}
                        // onChange={setSpeed}
                    />
                    <Text category='s1' style={styles.meterlabel}>Temperature</Text>
                </View>
            </View>
            <View style={styles.device}>
                <Text category='h5' style={styles.devicetitle}>Clinical Device: <Text category='s1' style={styles.devicename}>{clinicalDevice}</Text></Text>
                <Text category='s1' style={styles.devicetime}>{cycleDateTime}</Text>
                <View style={styles.buttons}>
                    {/* <TouchableOpacity style= {[styles.baricon,{marginRight:10}]} onPress={() => Alert.alert("Called")}>
                        <Image source={images.scanner} style={styles.logout} />
                    </TouchableOpacity> */}
                    <RoseButton
                        label="Add New"
                        onPress={() => navigation.navigate("AddDetails")}
                        // width={190}
                    />
                    {/* <RoseButton
                        label="Submit"
                        // onPress={() => handlecount()}
                        // width={190}
                    /> */}
                </View>
            </View>
        </View>
    </SafeAreaView>
  );
};
export default Home;

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
    speedometer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:10,
        height:'44%'
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