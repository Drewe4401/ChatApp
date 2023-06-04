// Chat.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import jwtDecode from "jwt-decode";
import { firebase } from '../config/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginScreenProps {
  navigation: any;
  route: any;
}

interface MessageItem {
  id: string;
  message: string;
  sender: 'user' | 'recipient';
  date: string;
}

interface DecodedToken {
  email: string;
  // Add other properties you expect in the token here
}
  
const Chat: React.FC<LoginScreenProps> = ({navigation, route}) => {
    const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [UserEmail, setUserEmail] = useState('');


  const sendMessage = () => {
    if (newMessage.trim().length > 0) {
      const db = firebase.firestore();

      let Temp = ""; // Declare variable to hold the username
  
      // First, get the Username from the Firestore document
      db.collection('users').doc(UserEmail).get().then((doc) => {
        if (doc.exists && doc.data()) {
          let data = doc.data();
          if(data) {
            Temp = data.Username; // Assign the username to `temp`
            // Rest of your code...
          }
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

      // get a reference to the 'messages' collection inside the specified document
      let messagesRef = db.collection('users')
                          .doc(UserEmail)
                          .collection('messaging_users')
                          .doc(emailMessage)
                          .collection('messages');
    
      // add a new document with the given message
      messagesRef.add({
        // assuming 'message' is an object containing the relevant fields
        message: newMessage,
        sender: 'user',
        date: new Date(),
      })
      .then((docRef) => {

          messagesRef = firebase.firestore().collection('users').doc(emailMessage).collection('messaging_users');
          messagesRef.doc(UserEmail).get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
              // If the document does not exist, add a new one
              messagesRef.doc(UserEmail).set({
                Email_Address: UserEmail,
                Username: Temp,
              })
              .then(() => {
                // Now you can add your message to the collection 'messages'
                messagesRef.doc(UserEmail).collection('messages').add({
                  message: newMessage,
                  sender: 'recipient',
                  date: new Date(),
                });
              })
              .catch((error) => {
                console.error('Error adding document: ', error);
              });
            } else {
              // If the document already exists, add the message to the existing 'messages' collection
              messagesRef.doc(UserEmail).collection('messages').add({
                message: newMessage,
                sender: 'recipient',
                date: new Date(),
              });
            }
          });
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error adding message: ', error);
      });
  };
}

  // Add this function inside the Chat component, before the renderItem function
const handleAddAttachment = () => {
    // Implement your logic for sending photos or attachments here
    console.log('Add attachment');
  };

  useEffect(() => {
    const setEmailAndSubscribe = async () => {
      const userEmail = await getEmailFromAuthToken();
  
      if (route.params?.email && userEmail) {
        const emailMessage = route.params.email;
        setEmailMessage(emailMessage);
  
        const unsubscribe = firebase
          .firestore()
          .collection('users')
          .doc(userEmail)
          .collection('messaging_users')
          .doc(emailMessage)
          .collection('messages')
          .orderBy('date', 'desc')
          .onSnapshot((snapshot) => {
            const fetchedMessages: MessageItem[] = [];
            snapshot.forEach((doc) => {
                fetchedMessages.unshift({
                    id: doc.id,
                    message: doc.data().message,
                    sender: doc.data().sender,
                    date: doc.data().date,
                });
            });
            setMessages(fetchedMessages);
          });
  
        return unsubscribe; // This function will be called when component unmounts
      }
    };
  
    setEmailAndSubscribe().then(unsubscribe => {
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    });
  }, [route.params?.email]);
  
  const getEmailFromAuthToken = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
  
      if (authToken) {
        const decodedToken = jwtDecode(authToken) as DecodedToken;
        const userEmail = decodedToken.email.toLowerCase();
        setUserEmail(userEmail);
        return userEmail;
      } else {
        console.log('No auth token found');
        return null;
      }
    } catch (error) {
      console.log('Error getting email from auth token:', error);
      return null;
    }
  };

  const renderItem = ({ item }: { item: MessageItem }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user'
          ? styles.userMessageContainer
          : styles.recipientMessageContainer,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user'
            ? styles.userMessageText
            : styles.recipientMessageText,
        ]}
      >
        {item.message}
      </Text>
    </View>
  );

  return (
  <KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={80}
  style={styles.container}
>
  <SafeAreaView style={styles.innerContainer}>
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.chatList}
    />
    <View style={styles.inputContainer}>
      {/* <TouchableOpacity onPress={handleAddAttachment} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity> */}
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message"
        multiline
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  messageContainer: {
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  innerContainer: {
    flex: 1,
  },
  addButton: {
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  recipientMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1E1E1',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  recipientMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15,
    borderTopColor: '#E1E1E1',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    minHeight: 40,
    backgroundColor: '#E1E1E1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sendButton: {
    marginLeft: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Chat;