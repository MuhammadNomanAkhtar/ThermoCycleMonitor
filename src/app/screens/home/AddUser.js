import { Divider, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState, useRef } from 'react';
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View, Image, Alert, PermissionsAndroid, Platform, Linking} from 'react-native';
import Colors from '../../../shared/constants/Colors';
import RoseInput from '../../components/Elements/RoseInput';
import { images } from '../../assets/pngs/ImagesList';
import RoseButton from '../../components/Elements/RoseButton';
import { SignUpUser } from '../../../shared/firebase/FirebaseAuthentication';
import { deviceIdValidator, emailValidator, integerValidator, passwordValidator } from '../../../shared/core/Validators';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import moment from 'moment';
import RoseIcon from '../../components/Elements/RoseIcon';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import FileViewer from "react-native-file-viewer";

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
  const svgRef = useRef()
  const viewShotRef = useRef();

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
  // const saveQRCodeToFileSystem = async (uri) => {
  //   // Extract the base64 data from the URI
  //   const base64Data = uri.replace(/^data:image\/png;base64,/, '');

  //   // Define the path to save the file
  //   const filePath = `${RNFS.ExternalDirectoryPath}/qrcode.png`;

  //   console.log(uri+"<<file path>>"+filePath)
  //   try {
  //     // Write the base64 data to the file
  //     await RNFS.writeFile(filePath, base64Data, 'base64');
  //     Alert.alert('Success', `File saved to ${filePath}`);
  //   } catch (err) {
  //     console.error('Error saving file', err);
  //     Alert.alert('Error', 'Failed to save file. Please try again.');
  //   }
  // };

  // const captureQRCode = () => {
  //   viewShotRef.current.capture().then(uri => {
  //     saveQRCodeToFileSystem(uri);
  //   });
  // };

  // const requestStoragePermission = async () => {
  //   const permission =
  //     Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      
  //   try {
  //     const result = await request(permission);
  //     alert("per"+result)
  //     return result === RESULTS.GRANTED;
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // };

  // const saveQRCodeToFileSystem = async (uri) => {
  //   const base64Data = uri.replace(/^data:image\/png;base64,/, '');
  //   const filePath = `${RNFS.DocumentDirectoryPath}/qrcode.png`;

  //   console.log(uri + "<<file path>>" + filePath);

  //   try {
  //     await RNFS.writeFile(filePath, base64Data, 'base64');
  //     Alert.alert('Success', `File saved to ${filePath}`);
  //   } catch (err) {
  //     console.error('Error saving file', err);
  //     Alert.alert('Error', 'Failed to save file. Please try again.');
  //   }
  // };

  // const captureQRCode = async () => {
  //   const permission = await requestStoragePermission();
  //   if (!permission) return;

  //   viewShotRef.current.capture().then(uri => {
  //     saveQRCodeToFileSystem(uri);
  //   });
  // };


  // const handleDownloadPDF = async (base64) => {
  //   try {
  //     // const path = RNFS.DocumentDirectoryPath+'/InziLava.pdf';
  //     // if(Platform.OS==="ios")
  //     // {
  //     const path =
  //       Platform.OS === 'ios'
  //         ? RNFS.DocumentDirectoryPath +
  //           `/${
  //             props.route.params.title +
  //             moment(new Date()).format('DDMMMYYYY_HH.mm')
  //           }.pdf`
  //         : RNFS.DownloadDirectoryPath +
  //           `/${
  //             (props.route.params.title).trim() +
  //             moment(new Date()).format('DDMMMYYYY_HH.mm')
  //           }.pdf`;
  //     //     }
  //     //     else
  //     //    {
  //     //         const path = RNFS.DownloadDirectoryPath+`/${props.route.params.title}.pdf`;
  //     //     }
  //     // const path = '/storage/android/data/test.pdf';
  //     const base64Content = base64.replace(
  //       /^data:application\/pdf;base64,/,
  //       '',
  //     );

  //     await RNFS.writeFile(path, base64Content, 'base64');
  //     console.log(`Saved to ${path?.replace(/ /g, '')}`);
  //     // Linking.openURL(path)
  //     Alert.alert(
  //       '',
  //       `File Downloaded Successfully at ${
  //         Platform.OS == 'ios'
  //           ? `Files/On My Iphone/Myindici 2.0/${
  //               props.route.params.title +
  //               moment(new Date()).format('DDMMMYYYY_HH.mm')
  //             }.pdf`
  //           : path
  //       }`,
  //       [
  //         {
  //           text: 'Ok',
  //           onPress: () => {
  //             // FileViewer.open(path?.replace(/ /g, ""))  old code
  //             FileViewer.open(path);
  //           },
  //         },
  //       ],
  //     );
  //     // Alert.alert('', `File Downloaded Successfully at ${path}`, [
  //     //     {
  //     //       text: 'Ok',
  //     //       onPress: () => {
  //     //         FileViewer.open(path?.replace(/ /g, ""))
  //     //       },
  //     //     },
  //     //   ]);

  //     return path;
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // };
  const handleDownloadImage = async (base64) => {
    try {
      // const path = RNFS.DocumentDirectoryPath+'/InziLava.pdf';
      const path =
        Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath +`/${deviceId.value}.png`
          : 
          RNFS.DownloadDirectoryPath +`/${deviceId.value}.png`;
      const base64Content = base64.replace( /^data:application\/pdf;base64,/, '');
      await RNFS.writeFile(path, base64Content, 'base64');
      // console.log(`Saved to ${path}`);
      // Linking.openURL(path)
      // alert("Image downloaded at:"+path)
      Alert.alert('', `QR Downloaded Successfully`
        , [
        {
          text: 'Ok',
          onPress: () => {
            FileViewer.open(path);
          },
        },
      ]
    );
      return path;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // const requestStoragePermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission Required',
  //           message: 'This app needs access to your storage to download files.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         }
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         return true;
  //       } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Storage permission is required to save the QR code. Please enable it from the app settings.',
  //           [
  //             { text: 'Cancel', style: 'cancel' },
  //             { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //           ]
  //         );
  //       } else {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Storage permission is required to save the QR code. Please enable it from settings.',
  //           [{ text: 'OK' }]
  //         );
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  // const saveQRCodeToGallery = async (uri) => {
  //   const permission = await requestStoragePermission();
  //   if (!permission) return;

  //   const filePath = `${RNFS.DocumentDirectoryPath}/qrcode.png`;

  //   RNFS.writeFile(filePath, uri, 'base64')
  //     .then(() => {
  //       console.log('File saved to', filePath);

  //       if (Platform.OS === 'android') {
  //         // CameraRoll.save(filePath, 'photo')
  //         CameraRoll.save(filePath, {type: 'photo'})
  //           .then(() => {
  //             console.log('QR code saved to gallery');
  //           })
  //           .catch(err => {
  //             console.log('Error saving to gallery', err);
  //           });
  //       } else {
  //         CameraRoll.save(filePath, { type: 'photo' })
  //           .then(() => {
  //             console.log('QR code saved to gallery');
  //           })
  //           .catch(err => {
  //             console.log('Error saving to gallery', err);
  //           });
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error saving file', err);
  //     });
  // };

  const captureQRCode = () => {
    viewShotRef.current.capture().then(uri => {
      // console.log('Captured', uri);
      handleDownloadImage(uri)
      // saveQRCodeToGallery(uri);
    });
  };
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
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0, result: 'base64'  }} style={styles.qr}>
              <QRCode
                value={`{deviceId:${deviceId.value}}`}
                size={100}
              />
            </ViewShot>
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
                <TouchableOpacity 
                    style= {styles.baricon}
                    onPress={() => captureQRCode()}>
                    <Icon name={'download-outline'} style={styles.logout} fill={"#fff"}/>
                </TouchableOpacity>
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
        // justifyContent:'center',
    },
    qr:{
      alignItems:'center',
      justifyContent:'center',
      height:'20%',
      marginVertical:40
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
    },
    baricon:{
      borderRadius: 5,
      justifyContent: 'center',
      alignItems:'center',
      height: 40,
      width: 40,
      backgroundColor: Colors.primary,
    },
    logout:{
      height:30,
      width:30
    },
});