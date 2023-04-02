import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { auth, database } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebase } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeProps {
  navigation: any;
}

const Register: React.FC<HomeProps> = (props) => {

  const [Email, setEmail] = useState('');
  const [Username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {

    const todoRef = firebase.firestore().collection('users').doc(Email);

    if(password !== confirmPassword){
      console.log("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, Email, password)
      .then(async (credentials) => {
        const token = await credentials.user.getIdToken();
        const User_data = {
          User_ID: credentials.user.uid,
          Username: Username,
          Email_Address: Email
        };
        todoRef
          .set(User_data).then(() => {console.log("Register Complete"); AsyncStorage.setItem('authToken', token); props.navigation.navigate('Home');})
          .catch((err) => Alert.alert("Register Error", err.message));
      })
      .catch((err) => Alert.alert("Register Error", err.message));
  };
  
  return (
    <ScrollView style={styles.container}>
    <KeyboardAvoidingView keyboardVerticalOffset={-200} behavior="position" style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={Email}
          placeholder="Enter Email Address"
          autoCapitalize="none"
        />
         <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={Username}
          placeholder="Enter Username"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0718C4',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Register;