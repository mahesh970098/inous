import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Device from './componets/src/Device'

import Login from './componets/src/Login'
import Home from './componets/src/Home'

import Patients from './componets/src/latest/Patients'
import Task from './componets/src/latest/Task'
import Reports from './componets/src/latest/Reports'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Test from './componets/src/latest/Test'

import Navbar from './componets/src/Navbar/Navbar'
const Stack = createNativeStackNavigator();
export default function App() {
  return (
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
          name="Device"
          component={Device}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})