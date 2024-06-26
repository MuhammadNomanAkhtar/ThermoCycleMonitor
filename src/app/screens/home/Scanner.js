import React,{ useEffect,useState} from 'react'
import { StyleSheet, Text, View, SafeAreaView, Alert, ActivityIndicator, Vibration, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Colors from '../../../shared/constants/Colors';

const {height, width} = Dimensions.get("window")

const Scanner = (props) => { 
  const navigation = useNavigation()
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused()

  const onSuccess = async e => {
    setIsLoading(true)
    setScanned(true);
    Vibration.vibrate();
    try {
      const scannedData = e.data;
      console.log(typeof(e.data),"Scanner Response:",JSON.parse(scannedData))
      let obj = e.data
      // if(props?.route?.params?.type == "Login" || props?.route?.params?.type == "AddDetails")
      // {
      //   obj = {
      //     deviceId: e.data
      //   }
      // }
      // else if(props?.route?.params?.type == "Signup")
      // {
      //   // obj = {
      //   //   deviceId: 1105,
      //   //   clinical_device: "General Closure # 2", 
      //   //   facility: "MooN Research Center", 
      //   //   technician: "M.N.A Aka-MooN", 
      //   //   temp: 470, 
      //   //   time: 56,
      //   // }
      //   obj = e.data
      // }
      if(obj != null)
      navigation.navigate(props?.route?.params?.type, JSON.parse(obj))
    } catch (error) {
      setIsLoading(false)
      setScanned(false);
      console.log('An error occurred during QR code scanning', error.message);
      Alert.alert('An error occurred during QR code scanning');
    }

  };
  const resetScanner = () => {
    setScanned(false);
  };
 
  return (
    <View style={{ flex: 1, backgroundColor:Colors.primary }}>
          <View style={{ width: '100%', height: height*10/100, backgroundColor: Colors.primary }}>
            <SafeAreaView>
              <View style={{ padding: 10,paddingTop:20 }}>
            {/* <CopilotLogo/> */}
              </View>
            </SafeAreaView>
            <View style={{ padding: 10, marginLeft: 10, flexDirection:'row', justifyContent:'space-between' }}>
              <Text style={{ fontWeight: 'bold',color:'#fff' }}>Scan the QR code below to get Device Id</Text>
            </View>

          </View>
          {isFocused && <View style={{ flex: 1}}>
          {scanned ?  
            <View style={{ flex:1 }}>
            <QRCodeScanner
              cameraStyle={styles.cam}
              />
            </View> : ( 
            <View style={{  justifyContent: 'center', alignItems: 'center' ,width:'100%', height: height*90/100}}>
              <QRCodeScanner
                onRead={onSuccess}
                cameraStyle={styles.cam}
                reactivate={true}
                reactivateTimeout={2000}          
                reactivateCallback={resetScanner}    
                markerStyle={styles.customMarker}
                showMarker={true}       
              />
            </View>
          )}
           
            </View>}
           {isLoading && (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default Scanner;
const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  activityIndicatorContainer: {
    position: 'absolute',
    top: 0,
     bottom: 0,
    left: 0,
    right: 0,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  cam: {
    height: '100%',
    width: '100%',
    alignSelf:'center'
  },
  customMarker: {
    padding: 10,
    borderColor: 'gray',
    borderRadius: 10,

  },
});
