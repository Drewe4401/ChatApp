import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UploadImage from './UploadImage';

interface LoginScreenProps {
  navigation: any;
}


const Profile: React.FC<LoginScreenProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    props.navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <View style={styles.topbackground}></View>
        <UploadImage/>
        </View>
        <View style={styles.inputcontainer}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
      />
      <Button title="Login" />
      <TouchableOpacity style={styles.logout} onPress={() => handleLogout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  topper:{
    alignItems:'center'
  },
  topbackground: {
    backgroundColor: '#f3322f',
    width: 500,
    height: 500,
    borderRadius: 500/2,
    bottom: 350,
  },
  logout: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF0000",
  },
  inputcontainer: {
    bottom:"55%",
  }
});

export default Profile;