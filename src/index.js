import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash, Login, Signup, Home, Scanner, AddDetails, ForgetPassword, AdminHome, AddUser } from './app/screens';
import { AuthContext } from './shared/core/Context';
import { Alert } from 'react-native';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const AuthStackScreen = props => {
  return (
    <AuthStack.Navigator
      options={{ headerShown: false }}
      initial
      initialRouteName={'Splash'}>
      <AuthStack.Screen
        name="Splash"
        options={{
          headerShown: false,
          title: 'Splash',
        }}
        component={Splash}
      />
      <AuthStack.Screen
        name="Login"
        options={{
          headerShown: false,
          title: 'Login',
        }}
        component={Login}
      />
      <AuthStack.Screen
        name="Signup"
        options={{
          headerShown: false,
          title: 'Signup',
        }}
        component={Signup}
      />
      <AuthStack.Screen
        name="Scanner"
        options={{
          headerShown: false,
          title: 'Scanner',
        }}
        component={Scanner}
      />
    </AuthStack.Navigator>
  );
};

const HomeStackScreen = props => {
  return (
    <HomeStack.Navigator
      options={{ headerShown: false }}
      initial
      initialRouteName={'Home'}>
      <HomeStack.Screen
        name="Home"
        options={{
          headerShown: false,
          title: 'Home',
        }}
        component={Home}
      />
      <HomeStack.Screen
        name="Scanner"
        options={{
          headerShown: false,
          title: 'Scanner',
        }}
        component={Scanner}
      />
    </HomeStack.Navigator>
  );
};

const RootStackNavigator = props => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {props.token ? (
        <RootStack.Screen name="Home" component={HomeStackScreen} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
      )}
    </RootStack.Navigator>
  );
};

const Apps = props => {
  // const [userToken, setUserToken] = React.useState(false);

  // const authContext = React.useMemo(() => {
  //   // console.log("logi  value", value)

  //   return {
  //     logIn: value => {
  //       Alert.alert("Login:"+value)
  //       setUserToken(value);
  //     },
  //     logOut: (value) => {
  //       Alert.alert("Logout:"+value)
  //       setUserToken(false);
  //     },
  //     authUser: userToken
  //   };
  // }, []);
  return (
    // <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      {/* <RootStackNavigator token={userToken} /> */}
      <RootStack.Navigator screenOptions={{ headerShown: false }}
        initialRouteName={'Splash'}>
        <RootStack.Screen
          name="Splash"
          options={{
            headerShown: false,
            title: 'Splash',
          }}
          component={Splash}
        />
        <RootStack.Screen
          name="Login"
          options={{
            headerShown: false,
            title: 'Login',
          }}
          component={Login}
        />
        <RootStack.Screen
          name="Signup"
          options={{
            headerShown: false,
            title: 'Signup',
          }}
          component={Signup}
        />
        <RootStack.Screen
          name="ForgetPassword"
          options={{
            headerShown: false,
            title: 'Forget Password',
          }}
          component={ForgetPassword}
        />
        <RootStack.Screen
          name="Scanner"
          options={{
            headerShown: false,
            title: 'Scanner',
          }}
          component={Scanner}
        />
        <RootStack.Screen
          name="Home"
          options={{
            headerShown: false,
            title: 'Home',
          }}
          component={Home}
        />
        <RootStack.Screen
          name="AddDetails"
          options={{
            headerShown: false,
            title: 'Add Details',
          }}
          component={AddDetails}
        />
        <RootStack.Screen
          name="AdminHome"
          options={{
            headerShown: false,
            title: 'Admin Home',
          }}
          component={AdminHome}
        />
        <RootStack.Screen
          name="AddUser"
          options={{
            headerShown: false,
            title: 'Add User',
          }}
          component={AddUser}
        />
      </RootStack.Navigator>
    </NavigationContainer>
    // </AuthContext.Provider>
  );
};

export default Apps;
