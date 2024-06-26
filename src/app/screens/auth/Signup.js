import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import { SignUp } from '../../../shared/firebase/FirebaseAuthentication';
import { deviceIdValidator, emailValidator, passwordValidator } from '../../../shared/core/Validators';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';

const {height, width} = Dimensions.get("window")

const Signup = (props) => {

  const navigation = useNavigation()
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({ value: "", error: "" });
  const [deviceId, setDeviceId] = useState({ value: "", error: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cPasswordVisible, setCPasswordVisible] = useState(false);
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async() =>{
    let emailerror = emailValidator(email.value);
    let passworderror = passwordValidator(password.value);
    let deviceIderror = deviceIdValidator(deviceId.value);
    let confirmpwdError = {value: confirmPassword.value, error: (confirmPassword.value == password.value)? "" : "Should be same as Password"};
    setEmail(emailerror);
    setPassword(passworderror);
    setDeviceId(deviceIderror);
    setConfirmPassword(confirmpwdError);

    if (emailerror.error == '' && passworderror.error == '' && confirmpwdError.error == '' && deviceIderror.error == '' && payload != null) {
      setLoading(true)
      console.log("Payload before:",payload)
      let res = await SignUp(email.value, password.value, deviceId.value, payload)
      if(res != null)
        {
          navigation.navigate("Login")
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
          setDeviceId({ value: data?.deviceId.toString(), error: "" })
          let obj = {
            clinical_device : data?.clinical_device,
            // cycle_datetime : moment(new Date()).utc().format("DD/MM/YYYY HH:mm"), 
            cycle_datetime : moment(new Date()).format("DD/MM/YYYY HH:mm"), 
            facility : data?.facility,
            technician : data?.technician, 
            temp : data?.temp, 
            time : data?.time
          }
          setPayload(obj)
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
                    placeholder={"Scan QR for Device Id"}
                    disabled={true}
                    value={deviceId.value}
                    onChangeText={nextValue => setDeviceId({ value: nextValue, error: '' })}
                    status={deviceId.error == '' ? false : true}
                    errorMessage={deviceId.error}
                    loader={
                      <TouchableOpacity onPress={()=>{
                        navigation.navigate("Scanner",{type: "Signup"})
                      }}>
                        <Image source={images.scannerGrey} style={styles.icon} />
                      </TouchableOpacity>
                    }
                />
            </View>
            <View style={styles.buttons}>
              <RoseButton
                label="SignUp"
                onPress={() => handleSignup()}
                // width={190}
                disabled={loading ? true : false}
                isLoading={loading}
              />
            </View>
            <Divider style={styles.divider}/>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text category='s1' style={styles.signupmain}>Already have an account! <Text category='s1' style={styles.signup}>Login</Text></Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};
export default Signup;

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