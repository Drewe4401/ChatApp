// ChatView.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

interface LoginScreenProps {
    navigation: any;
  }

interface DecodedToken {
    email: string;
    // Add other properties you expect in the token here
  }
  
const ChatView: React.FC<LoginScreenProps> = (props) => {

    
  const [email, setEmail] = useState('');
  const [UserEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  const fetchUserData = async (email : string) => {
    console.log(email.toLowerCase());
  
    try {
      const userSnapshot = await firebase.firestore().collection('users').where('Email_Address', '==', email.toLowerCase()).get();
      if (!userSnapshot.empty) {
        console.log(userSnapshot.docs[0]);
        const newEmail = userSnapshot.docs[0].get('Email_Address');
        return { userData: userSnapshot.docs[0].data(), userEmail: newEmail };
      } else {
        Alert.alert("User not found");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  
  const createChat = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      let userEmail = '';
      if (authToken) {
        const decodedToken = jwtDecode(authToken) as DecodedToken;
        userEmail = decodedToken.email.toLowerCase();
      }
      const result = await fetchUserData(email);
      if (result) {
        const { userData, userEmail: newEmail } = result;
        const todoRef = firebase.firestore().collection('users').doc(userEmail).collection('messaging_users').doc(newEmail);
        todoRef.set(userData);
        props.navigation.navigate("Chat", {email: email});
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Recipient's Email"
        keyboardType="email-address"
      />
      <Button title="Create Chat" onPress={createChat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default ChatView;