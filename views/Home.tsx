import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
}

const chats: Chat[] = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey there!' },
  { id: '2', name: 'Jane Smith', lastMessage: 'What\'s up?' },
  // Add more chat data here
];

const Home: React.FC = () => {
  const renderItem = ({ item }: { item: Chat }) => (
    <View style={styles.chatItem}>
      <Text style={styles.chatName}>{item.name}</Text>
      <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#777',
  },
});

export default Home;