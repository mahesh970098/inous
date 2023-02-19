import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Device from './componets/src/Device'

import Login from './componets/src/Login'
import Home from './componets/src/Home'

import Patients from './componets/src/latest/Patients'
import Task from './componets/src/latest/Task'
import Reports from './componets/src/latest/Reports'
import Test_oxio from './componets/src/Test_oxio'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Test from './componets/src/latest/Test'

import Navbar from './componets/src/Navbar/Navbar'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Bletest from './componets/src/Bletest'
import demo from './componets/src/demo'
import Test_data from './componets/src/latest/Test_data'
var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

const Stack = createNativeStackNavigator();
export default function App() {

  const [isLoading12, isLoading1] = useState(false)


  useEffect(() => {
    isLoading1(true)
    setTimeout(() => {

      isLoading1(false)
    }, 3000);
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>

      {isLoading12 ? (<>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#ffcccc' }}>

          <LottieView style={{ width: wp('50%'), height: hp('20%'), justifyContent: 'center' }} source={require('./componets/assets/json/129223-heart-rate01.json')} autoPlay loop />
          <Image style={{ width: wp('70%'), height: hp('20%') }} source={require("./componets/assets/splash_logo.png")} />
        </View>
      </>) : (<>

        <NavigationContainer>
          <Stack.Navigator>



            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen
              name="Navbar"
              component={Navbar}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Patients"
              component={Patients}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Task"
              component={Task}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reports"
              component={Reports}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Test"
              component={Test}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="demo"
              component={demo}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Device"
              component={Device}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Bletest"
              component={Bletest}
              options={{ headerShown: false }}
            />


            {/* <Stack.Screen
              name="demo"
              component={demo}
              options={{ headerShown: false }}
            /> */}

            <Stack.Screen
              name="Test_oxio"
              component={Test_oxio}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Testdata"
              component={Test_data}
              options={{ headerShown: false }}
            />


          </Stack.Navigator>
        </NavigationContainer>




      </>)

      }


    </SafeAreaView>

  )
}

const styles = StyleSheet.create({})