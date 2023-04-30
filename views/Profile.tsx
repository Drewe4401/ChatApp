import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';


const Profile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (email: string, password: string) => {
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <View style={styles.topbackground}></View>
        </View>
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
      <Button title="Login" onPress={() => handleLogin(email, password)} />
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
});

export default Profile;