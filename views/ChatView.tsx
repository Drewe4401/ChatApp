// ChatView.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config/firebase';

interface LoginScreenProps {
    navigation: any;
  }
  
const ChatView: React.FC<LoginScreenProps> = (props) => {

    
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const fetchUserData = async (email : any) => {
    try {
      const userSnapshot = await firebase.firestore().collection('users').where('email', '==', email).get();
      if (!userSnapshot.empty) {
        return userSnapshot.docs[0].data();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const createChat = async () => {
    try {
      const userData = await fetchUserData(email);
      if (userData) {
        // You can create chat logic here
        // For example, create a chat document in Firestore, add members to the chat, etc.
        
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