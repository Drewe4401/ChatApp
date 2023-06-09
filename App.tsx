import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Login from './views/Login';
import Home from './views/Home';
import Profile from './views/Profile';
import Register from './views/Register';
import ChangePassword from './views/ChangePassword';
import CustomHeader from './views/CustomHeader';
import ProfileView from './views/ProfileView';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import the drawer components
import ChatView from './views/ChatView';
import Chat from './views/Chat';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator(); // Create a Drawer navigator


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" options={{headerTitleAlign: 'center'}} component={Home} />
      <Drawer.Screen name="Profile" options={{header: ({ navigation, route }) => (
      <CustomHeader navigation={navigation} title={route.name} />
    ),}} component={Profile} />
    </Drawer.Navigator>
  );
};


const App = () => {
  return (
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{headerShown: false, gestureEnabled: false}} component={Login} />
        <Stack.Screen name="Register" options={{headerShown: false, gestureEnabled: false}}  component={Register} />
        <Stack.Screen name="DrawerNavigator" options={{headerShown: false, gestureEnabled: false}} component={DrawerNavigator}/>
        <Stack.Screen name="ChangePassword" options={{title: "Change Password", headerTitleAlign: 'center'}}  component={ChangePassword} />
        <Stack.Screen name="ChatView" options={{title: "Find User", headerTitleAlign: 'center', headerBackTitle: 'Home'}}  component={ChatView} />
        <Stack.Screen name="ProfileView" options={{title: "Find User", headerTitleAlign: 'center'}}  component={ProfileView} />
        <Stack.Screen name="Chat" options={{title: "Chat", headerTitleAlign: 'center', headerBackTitle: 'Home'}}  component={Chat} />
      </Stack.Navigator>
      </NavigationContainer>
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