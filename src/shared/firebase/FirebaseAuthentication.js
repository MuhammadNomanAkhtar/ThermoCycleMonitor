import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import database from '@react-native-firebase/database';
import { AuthContext } from '../core/Context';
import { useContext } from 'react';
import { clearUserAsyncData, setUserAsyncData } from '../asyncstorage/UserAsync';


export const SignIn = async(email, pwd, deviceId) => {
    // const { logIn } = useContext(AuthContext);
  var result = null;
   await auth()
  .signInWithEmailAndPassword(email, pwd)
  .then(async(res) => {
      console.log('user authenticated success',res);
      await database()
      .ref(`devices/${deviceId}`)
      .once('value')
      .then(snapshot => {
        let data = snapshot.val()
        // let {ListenerLanguage, SpeakerLanguage} = snapshot.val()
        console.log("Login Data Fetched Successfully:",snapshot.val())
        if(data == null || data?.email.toLowerCase() != email.toLowerCase()){
            SignOut()
            Alert.alert("Invalid Device Id!")
        }
        else{
            Alert.alert("Logged In Successfully!")
            setUserAsyncData(deviceId)
            result = snapshot.val()
            console.log("reeee:",result)
        }
        
      })
      .catch((error) => {
        console.log("Error Reading Login Fiebase Data:",error)
        SignOut()
      })
  })
  .catch(async (err2) => {
      console.log('err2>>', err2.code);
      if (err2.code == "auth/invalid-credential") {
        Alert.alert("Invalid Credentials!")
      }
      else if (err2.code == "auth/internal-error"){
        Alert.alert("This Email doesn't exists!")
      }
      else if (err2.code === "auth/invalid-email") { 
        Alert.alert('Email is invalid!'); 
      }
      else{
        Alert.alert('Authentication Failed. Please try again later!') 
      }
  });
//   if(data)
  return result;
}

export const SignUp = async(email, pwd, deviceId, payload) => {
    var result = null;
    await auth().createUserWithEmailAndPassword(email, pwd)
    .then(async(res) => { 
        Alert.alert("Signed Up Successfully!")
        console.log('User account created & signed in!',res);
        result = true;
        // await database()
        // .ref(`devices/${deviceId}`)
        // .set(payload)
        // .then((res) => {
        //     Alert.alert("Signed Up Successfully!")
        //     console.log("Signup Data Saved Successfully:",res)
        //     result = true;
        // })
        // .catch((error) => {
        //     Alert.alert('Authentication Failed. Please try again later!') 
        //     console.log('Error Reading Signup Date',error)
        //     SignOut()
        // });
    })
    .catch(error => {
        console.log("Error Firebase Auth",error)
        if (error.code === "auth/email-already-in-use") { 
            Alert.alert('This Email is already in use!')
        }
        else if (error.code === "auth/invalid-email") { 
            Alert.alert('Email is invalid!') 
        }
        else if (error.code == "auth/weak-password")
        {
            Alert.alert('This Password is Weak')
        }
        else{
            Alert.alert('Authentication Failed. Please try again later!') 
        }
    });
    return result;
}

export const SignOut = async () => {
    // const { logOut } = useContext(AuthContext);
    console.log('inside FirebaseSignout');
    await auth()
    .signOut()
        .then(() => {
            // logOut(false)
            clearUserAsyncData()
            console.log('User signed out!')
        })
        .catch((err) => {
            console.log(err);
        });
}