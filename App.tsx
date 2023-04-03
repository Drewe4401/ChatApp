import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Login from './views/Login';
import Home from './views/Home';
import Profile from './views/Profile';
import Register from './views/Register';
import CustomHeader from './views/CustomHeader';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import the drawer components

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator(); // Create a Drawer navigator


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" >
      <Drawer.Screen name="Home" options={{headerTitleAlign: 'center'}} component={Home} />
      <Drawer.Screen name="Profile" options={{header: ({ navigation, route }) => (
      <CustomHeader navigation={navigation} title={route.name} />
    ),}} component={Profile} />
    </Drawer.Navigator>
  );
};


const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="DrawerNavigator" options={{headerShown: false}} component={DrawerNavigator}/>
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default App;