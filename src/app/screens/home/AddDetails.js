import { Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import { clinicalDeviceValidator, dateTimeValidator, integerValidator, passwordValidator, temperatureValidator, timeValidator } from '../../../shared/core/Validators';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from 'react-native-date-picker';
import database from '@react-native-firebase/database';
import moment from 'moment';
import { getUserAsyncData } from '../../../shared/asyncstorage/UserAsync';
const {height, width} = Dimensions.get("window")

const AddDetails = (props) => {
  const navigation = useNavigation()
  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState({ value: "", error: "" });
  const [temperature, setTemperature] = useState({ value: "", error: "" });
  const [time, setTime] = useState({ value: "", error: "" });
  const [deviceId, setDeviceId] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

const handleSubmit = () => {

    getUserAsyncData().then(async(res)=>{
    
    let dateTimeerror = dateTimeValidator(dateTime.value);
    let temperatureerror = temperatureValidator(temperature.value);
    let timeerror = timeValidator(time.value);
    let deviceIderror = clinicalDeviceValidator(deviceId.value);
    setDateTime(dateTimeerror);
    setTemperature(temperatureerror);
    setTime(timeerror);
    setDeviceId(deviceIderror);

    if (dateTimeerror.error == '' && temperatureerror.error == '' && deviceIderror.error == '' && timeerror.error == '') {
      setLoading(true)
      let payload = {
          clinical_device: deviceId.value,
        //   cycle_datetime: moment(dateTime.value).utc().format("DD/MM/YYYY HH:mm"),
          cycle_datetime: dateTime.value != ""? moment(dateTime.value).format("DD/MM/YYYY HH:mm") : "",
          temp: temperature.value,
          time: time.value
      }
      await database()
        .ref(`devices/${res}`)
        .update(payload)
        .then((res) => {
            Alert.alert("Details Added Successfully!")
            navigation.navigate("Home")
            setLoading(false)
        })
        .catch((error) => {
            Alert.alert('Failed to Add Details. Please try again later!') 
            setLoading(false)
        });
    }
    })
}

useEffect(()=>{
    if(props?.route?.params?.clinical_device != null)
      {
        setDeviceId({value:props?.route?.params?.clinical_device, error:""})
      }
},[props])

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        </View>
        <View style={styles.body}>
            <Text category='h5' style={{marginBottom:20, alignSelf:'center'}}> Add Details</Text>
            <View style={styles.fields}>
                <RoseInput
                    value={temperature.value}
                    onChangeText={nextValue =>{
                        let a = integerValidator(nextValue)
                        setTemperature({ value: a, error: '' })}}
                    status={temperature.error == '' ? false : true}
                    errorMessage={temperature.error}
                    placeholder={'Enter Temperature here'}
                    keyboard={"number-pad"}
                    loader={ <Icon style={styles.icon} name={'thermometer-outline'} fill={'grey'} /> }
                />
                <RoseInput
                    value={time.value}
                    onChangeText={nextValue =>{
                        let a = integerValidator(nextValue)
                        setTime({ value: a, error: '' })}}
                    status={time.error == '' ? false : true}
                    errorMessage={time.error}
                    placeholder={'Enter Cycle Time in Mins here'}
                    keyboard={"number-pad"}
                    loader={ <Icon style={styles.icon} name={'clock-outline'} fill={'grey'} /> }
                />
                <DateTimePicker
                    modal
                    open={open}
                    date={new Date()}
                    maximumDate={new Date()}
                    mode="datetime"
                    onConfirm={nextValue => {
                        setOpen(false);
                        setDateTime({value: nextValue, error: ""})
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
                <TouchableOpacity onPress={() => setOpen(true)} style={{ width: "100%", borderRadius: 4, borderColor: dateTime.error == ""? '#f3f3f3' : "red", borderWidth: 1, backgroundColor: "#F7F9FC", height: 40, flexDirection: "row", alignItems: 'center'}}>
                    <View style={{ width: "88%", paddingLeft: 13, }}>
                        {dateTime.value == "" ?
                            <Text style={{ fontSize: 17, color:'#9ea9bd'}}>Select Date</Text>
                        :
                            <Text style={{ fontSize: 17, }}>{moment(dateTime.value).format("DD/MM/YYYY HH:mm")}</Text>
                        }
                    </View>
                    <View style={{ width: "12%", padding: 5 }}>
                        <Icon name="calendar-outline" fill="grey" style={{ width: 23, height: 23, marginLeft:-5}} />
                    </View>
                </TouchableOpacity>
                {dateTime.error != "" &&
                    <Text style={{marginTop:5, marginLeft:2, fontSize:11, color:'red'}}>{dateTime.error}</Text>
                }
                <RoseInput
                    placeholder={"Scan QR for Clinical Device"}
                    disabled={true}
                    value={deviceId.value}
                    onChangeText={nextValue => setDeviceId({ value: nextValue, error: '' })}
                    status={deviceId.error == '' ? false : true}
                    errorMessage={deviceId.error}
                    loader={
                      <TouchableOpacity onPress={()=>{
                        navigation.navigate("Scanner",{type: "AddDetails"})
                      }}>
                        <Image source={images.scannerGrey} style={styles.icon} />
                      </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.buttons}>
                <RoseButton
                    label="Close"
                    onPress={() => navigation.navigate("Home")}
                    // width={190}
                    disabled={loading ? true : false}
                />
                <RoseButton
                    label="Submit"
                    onPress={() => handleSubmit()}
                    // width={190}
                    disabled={loading ? true : false}
                    isLoading={loading}
                />
            </View>
        </View>
    </SafeAreaView>
  );
};
export default AddDetails;

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
        padding:20,
        justifyContent:'center',
    },
    fields:{
        justifyContent:'space-between',
        width:'100%',
        height:'35%',
    },
    icon:{ 
      width: 20, 
      height: 20,
    },
    forget:{
        alignSelf:'flex-end',
        marginTop:2
    },
    buttons:{
        flexDirection:'row',
        alignSelf:'flex-end',
        alignItems:'center',
        marginTop:20,
    },
    divider:{
      marginVertical:20
    },
    signupmain:{
      alignSelf:'center'
    },
    signup:{
      color:"#0000EE",
    }
});