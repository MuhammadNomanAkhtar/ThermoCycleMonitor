import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {SafeAreaView, View} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import { Text } from '@ui-kitten/components';
import LottieView from 'lottie-react-native';
const Splash = () => {
    const navigation = useNavigation()
    const [slogan, setSlogan] = useState('')
    useEffect(()=>{
        setTimeout(()=>{
            setSlogan('Harness the Power of Precision')
        },1000)
        setTimeout(()=>{
            navigation.navigate("Login")
        },2000)
    },[])
  return (
    <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F9FCFF'}}>
        {/* <Logo style={{}} height={150} width={150}/> */}
        <LottieView source={require('../../assets/animations/Animation.json')} autoPlay loop speed={1} style={{aspectRatio:1, height:200, width:200}}/>
        <View style={{backgroundColor:slogan != ''? Colors.primary : "#fff", padding:10, borderRadius:5, marginTop:20}}>
          <Text category='s1' style={{color:"#fff"}}>{slogan}</Text>
        </View>
    </SafeAreaView>
  );
};
export default Splash;