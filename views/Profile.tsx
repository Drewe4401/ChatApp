import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UploadImage from './UploadImage';
import jwtDecode from 'jwt-decode';
import { firebase } from '../config/firebase';

interface LoginScreenProps {
  navigation: any;
}

interface DecodedToken {
  email: string;
  // Add other properties you expect in the token here
}

const Profile: React.FC<LoginScreenProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const getEmail = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        const decodedToken = jwtDecode(authToken) as DecodedToken;
        setEmail(decodedToken.email);
      }
    };
    getEmail();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    props.navigation.navigate("Login");
  };

  const handleChangePassword = () => {
    props.navigation.navigate("ChangePassword");
  };

  const handleProfileImage = () => {
    const todoRef = firebase.firestore().collection('users').doc(email.toLowerCase());
  }

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <View style={styles.topbackground}></View>
        <UploadImage/>
      </View>
      <View style={styles.inputcontainer}>
      <TouchableOpacity style={styles.changePassword} onPress={handleProfileImage}>
          <Text>Update Profile Image</Text>
      </TouchableOpacity>
        <Text>Email: {email}</Text>
        <TouchableOpacity style={styles.changePassword} onPress={handleChangePassword}>
          <Text>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
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
  changePassword: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#f5ba13",
  },
  logout: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#FF0000",
  },
  inputcontainer: {
    bottom:"55%",
  }
});

export default Profile;