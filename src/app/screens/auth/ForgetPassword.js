import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Alert} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import { SignIn } from '../../../shared/firebase/FirebaseAuthentication';
import { deviceIdValidator, emailValidator, passwordValidator, integerValidator } from '../../../shared/core/Validators';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import auth from '@react-native-firebase/auth';
const {height, width} = Dimensions.get("window")

const Login = (props) => {
  const navigation = useNavigation()
  const [email, setEmail] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async() =>{
    let emailerror = emailValidator(email.value);
    setEmail(emailerror);

    if (emailerror.error == '') {
        setLoading(true)
        await auth().sendPasswordResetEmail(email.value)
        .then((result) => {
            console.log("Reset Respo:"+JSON.stringify(result))
            Alert.alert('Success', 'Password reset email sent.');
            setLoading(false)
        })
        .catch ((error) => {
            Alert.alert('Error', error.message);
            setLoading(false)
        })
    }
  }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <Icon style={{ width: 30, height: 30 }} fill="#FFF" name="arrow-ios-back-outline" />
                <Text category='s1' style={{ color: '#fff', textAlignVertical: 'center' }}>Back</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.body}>
            <LottieView source={require('../../assets/animations/ForgetAnimation.json')} autoPlay loop speed={1} style={{aspectRatio:1, height:350, width:350, alignSelf:'center'}}/>
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
            </View>
            <View style={styles.buttons}>
              <RoseButton
                label="Reset"
                onPress={() => handlePasswordReset()}
                // width={190}
                disabled={loading ? true : false}
                isLoading={loading}
              />
            </View>
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
        // justifyContent:'center',
    },
    fields:{
        // flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        height:'8%',
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