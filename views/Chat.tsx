// Chat.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface LoginScreenProps {
    navigation: any;
  }

interface MessageItem {
    id: string;
    text: string;
    sender: 'user' | 'recipient';
}
  
const Chat: React.FC<LoginScreenProps> = (props) => {
    const [messages, setMessages] = useState<MessageItem[]>([
        { id: '1', text: 'Hello!', sender: 'user' },
        { id: '2', text: 'Hi!', sender: 'recipient' },
        { id: '3', text: 'How are you?', sender: 'user' },
      ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim().length > 0) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: newMessage, sender: 'user' },
      ]);
      setNewMessage('');
    }
  };

  // Add this function inside the Chat component, before the renderItem function
const handleAddAttachment = () => {
    // Implement your logic for sending photos or attachments here
    console.log('Add attachment');
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
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleAddAttachment} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
    borderTopColor: '#E1E1E1',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
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