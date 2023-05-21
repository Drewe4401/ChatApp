// ChangePassword.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import jwtDecode from 'jwt-decode';
import { EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

interface ChangePasswordProps {
  navigation: any;
}

interface DecodedToken {
    email: string;
    // Add other properties you expect in the token here
  }

const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [email, setEmail] = useState('');

  const getEmailFromAuthToken = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');

      if (authToken) {
        const decodedToken = jwtDecode(authToken) as DecodedToken;
        setEmail(decodedToken.email);
        return decodedToken.email;
      } else {
        console.log('No auth token found');
        return null;
      }
    } catch (error) {
      console.log('Error getting email from auth token:', error);
      return null;
    }
  };

  const handleChangePassword = async () => {
    // Perform validation and password change logic here
    // This example assumes you have a method called 'changeUserPassword' that takes the current password and new password as arguments
    if (newPassword === confirmNewPassword) {
      const userEmail = await getEmailFromAuthToken(); // Get the email directly
      if (userEmail) {
        // Call your API to change the user's password
        try {
          const result = await changeUserPassword(userEmail.toLowerCase(), currentPassword, newPassword);
            Alert.alert('Success', 'Your password has been changed');
            props.navigation.goBack();
        } catch (error) {
        console.log('Error details:', error); // Add this line to log the error details
          Alert.alert('Error', 'An error occurred while changing the password');
        }
      }
    } else {
      Alert.alert('Error', 'New passwords do not match');
    }
  };

  const changeUserPassword = async (email: any, currentPassword: any, newPassword: any) => {
    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), currentPassword).then(async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            const credential = EmailAuthProvider.credential(email.toLowerCase(), currentPassword);
    
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            console.log('true');
            return true;
          } catch (error) {
            console.error('Error updating password:', error);
            throw new Error('Error updating password');
          }
        } else {
          console.error('No user is currently signed in');
          throw new Error('No user is currently signed in');
        }
      });
    } catch (error) {
      console.error('Error in changeUserPassword:', error);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
      
        style={styles.input}
        onChangeText={setCurrentPassword}
        value={currentPassword}
        placeholder="Current Password"
        secureTextEntry
        
      />
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        placeholder="New Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmNewPassword}
        value={confirmNewPassword}
        placeholder="Confirm New Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleChangePassword}>
      <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{x: 1, y: 1 }}
              colors={['#0b9df5', '#0b76f5', '#0b4ff5', '#0b4ff5', '#0b28f5']}
              style={styles.submit}>
        <Text>Submit</Text>
      </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderBottomColor: 'gray',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  submit: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    marginLeft: '25%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },
});

export default ChangePassword;