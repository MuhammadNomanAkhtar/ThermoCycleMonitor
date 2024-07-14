import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import { SignUpUser } from '../../../shared/firebase/FirebaseAuthentication';
import { deviceIdValidator, emailValidator, integerValidator, passwordValidator } from '../../../shared/core/Validators';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';

const {height, width} = Dimensions.get("window")

const AddUser = (props) => {

  const navigation = useNavigation()
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });
  const [deviceId, setDeviceId] = useState({ value: "", error: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cPasswordVisible, setCPasswordVisible] = useState(false);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddUser = async() =>{
    let emailerror = emailValidator(email.value);
    let passworderror = passwordValidator(password.value);
    // let deviceIderror = deviceIdValidator(deviceId.value);
    let confirmpwdError = {value: confirmPassword.value, error: (confirmPassword.value == password.value)? "" : "Should be same as Password"};
    setEmail(emailerror);
    setPassword(passworderror);
    // setDeviceId(deviceIderror);
    setConfirmPassword(confirmpwdError);

    if (emailerror.error == '' && passworderror.error == '' && confirmpwdError.error == '') {
      setLoading(true)
      let payload = {
        clinical_device : "General Closure # Test",
        cycle_datetime : moment(new Date()).format("DD/MM/YYYY HH:mm"), 
        email: email.value,
        facility : "Test Research Center",
        technician : "Test Technician", 
        temp : "25", 
        time : "30",
        role: "user"
      }
      console.log("Payload before:",payload)
      let res = await SignUpUser(email.value, password.value, deviceId.value, payload)
      if(res != null)
        {
          navigation.navigate("AdminHome")
          setLoading(false)
        }
        else{
          setLoading(false)
        }
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      if(props?.route?.params)
        { let data = props?.route?.params
          setDeviceId({ value: data?.nextDeviceId.toString(), error: "" })
        }
    }, [props])
  );
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            {/* <View>
                <Text category='h5' style={styles.username}>Francis Aka-eri</Text>
                <Text category='s1' style={styles.role}>Bright Research Center</Text>
            </View>
            <Icon
                style={styles.logout}
                fill={"#fff"}
                name='log-out-outline'
            /> */}
        </View>
        <View style={styles.body}>
            <View style={styles.fields}>
                <RoseInput
                    placeholder={"Enter email here"}
                    value={email.value}
                    onChangeText={nextValue =>
                      setEmail({ value: nextValue, error: '' })
                    }
                    status={email.error == '' ? false : true}
                    errorMessage={email.error}
                    loader={
                      <TouchableOpacity>
                        <Icon
                          style={styles.icon}
                          name={'email-outline'}
                          fill={'grey'}
                        />
                      </TouchableOpacity>
                    }
                />
                <RoseInput
                  value={password.value}
                  onChangeText={nextValue =>
                    setPassword({ value: nextValue, error: '' })}
                  secureTextEntry={!passwordVisible}
                  status={password.error == '' ? false : true}
                  errorMessage={password.error}
                  placeholder={'Enter password here'}
                  loader={
                    <TouchableOpacity 
                    onPress={() => setPasswordVisible(!passwordVisible) }
                    >
                      <Icon
                        style={styles.icon}
                        name={  passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                        fill={'grey'}
                      />
                    </TouchableOpacity>
                  }
                />
                <RoseInput
                  value={confirmPassword.value}
                  onChangeText={nextValue =>
                    setConfirmPassword({ value: nextValue, error: '' })}
                  secureTextEntry={!cPasswordVisible}
                  status={confirmPassword.error == '' ? false : true}
                  errorMessage={confirmPassword.error}
                  placeholder={'Confirm password here'}
                  loader={
                    <TouchableOpacity 
                    onPress={() => setCPasswordVisible(!cPasswordVisible) }
                    >
                      <Icon
                        style={styles.icon}
                        name={  cPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                        fill={'grey'}
                      />
                    </TouchableOpacity>
                  }
                />
                <RoseInput
                    placeholder={"Scan QR or Enter Device Id"}
                    disabled={true}
                    value={deviceId.value}
                    onChangeText={nextValue => {
                      let a = integerValidator(nextValue)
                      setDeviceId({ value: a, error: '' })}}
                    status={deviceId.error == '' ? false : true}
                    errorMessage={deviceId.error}
                    loader={<Image source={images.scannerGrey} style={styles.icon} />}
                />
            </View>
            <View style={styles.buttons}>
                <RoseButton
                    label="Close"
                    onPress={() => navigation.navigate("AdminHome")}
                    // width={190}
                    disabled={loading ? true : false}
                />
                <RoseButton
                    label="Add"
                    onPress={() => handleAddUser()}
                    // width={190}
                    disabled={loading ? true : false}
                    isLoading={loading}
                />
            </View>
        </View>
    </SafeAreaView>
  );
};
export default AddUser;

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
        // backgroundColor:Colors.primary,
        // borderBottomLeftRadius:20,
        // borderBottomRightRadius:20
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
        // flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        height:'30%',
    },
    icon:{ 
      width: 20, 
      height: 20 
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
      color:"#3c2bf0",
    }
});