import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import { SignIn } from '../../../shared/firebase/FirebaseAuthentication';
import { deviceIdValidator, emailValidator, passwordValidator } from '../../../shared/core/Validators';
import { useNavigation } from '@react-navigation/native';
const {height, width} = Dimensions.get("window")

const Login = (props) => {
  const navigation = useNavigation()
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [deviceId, setDeviceId] = useState({ value: "", error: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async() =>{
    let emailerror = emailValidator(email.value);
    let passworderror = passwordValidator(password.value);
    let deviceIderror = deviceIdValidator(deviceId.value);
    setEmail(emailerror);
    setPassword(passworderror);
    setDeviceId(deviceIderror)

    if (emailerror.error == '' && passworderror.error == '' && deviceIderror.error == '') {
      setLoading(true)
      let res = await SignIn(email.value, password.value, deviceId.value)
      if(res != null){
        navigation.navigate("Home",{data: res, deviceId:deviceId.value})
        setLoading(false)
      }
      else{
        setLoading(false)
      }
    }
  }
  useEffect(()=>{
    if(props?.route?.params?.deviceId != null)
      {
        setDeviceId({value:props?.route?.params?.deviceId, error:""})
      }
  },[props])
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
                    placeholder={"Scan QR for Device Id"}
                    disabled={true}
                    value={deviceId.value}
                    onChangeText={nextValue => setDeviceId({ value: nextValue, error: '' })}
                    status={deviceId.error == '' ? false : true}
                    errorMessage={deviceId.error}
                    loader={
                      <TouchableOpacity onPress={()=>{
                        navigation.navigate("Scanner",{type: "Login"})
                      }}>
                        <Image source={images.scannerGrey} style={styles.icon} />
                      </TouchableOpacity>
                    }
                />
            </View>
            <Text category='s1' style={styles.forget}>Forget Password?</Text>
            <View style={styles.buttons}>
              <RoseButton
                label="Login"
                onPress={() => handleLogin()}
                // width={190}
                disabled={loading ? true : false}
                isLoading={loading}
              />
            </View>
            <Divider style={styles.divider}/>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text category='s1' style={styles.signupmain}>Don't have an account! <Text category='s1' style={styles.signup}>Signup</Text></Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};
export default Login;

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
        height:'23%',
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