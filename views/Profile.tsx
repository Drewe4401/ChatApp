import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UploadImage from './UploadImage';
import jwtDecode from 'jwt-decode';
import { firebase } from '../config/firebase';
import { LinearGradient } from 'expo-linear-gradient';


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
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{x: 1, y: 1 }}
            colors={['#5851DB', '#C13584', '#E1306C', '#FD1D1D', '#F77737']}
            style={styles.topbackground}
            >
        </LinearGradient>
        
        <UploadImage/>
      </View>
      
      <View style={styles.inputcontainer}>
        {/* /*<Text>User Name: {}</Text> */}
        <View style={styles.combineContainer}>
          <View style={styles.SquareShapeView}>
          <Text>User Email:</Text>
          </View>
          <View style={styles.RectangleShapeView}>
          <Text>{email}</Text>

          </View>
        </View>
        
        <TouchableOpacity onPress={handleChangePassword}>
          <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{x: 1, y: 1 }}
              colors={['#f5650b', '#f58c0b', '#f59f0b', '#f5c60b', '#f5da0b']}
              style={styles.changePassword}>
              <Text>Change Password</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
        <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{x: 1, y: 1 }}
              colors={['#f50b28', '#f5160b', '#f53d0b', '#f5500b', '#f5640b']}
              style={styles.logout}>
          <Text>Logout</Text>
          </LinearGradient>
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    
  },
  changePassword: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#f5ba13",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  logout: {
    width: "100%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#FF0000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  inputcontainer: {
    bottom:"55%",
  },
  combineContainer:{
    flexDirection: "row",
  } , 
  SquareShapeView: {
    backgroundColor: '#f5da0b',
    height: 40,
    marginVertical: 1,
    flexBasis:80,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },
  RectangleShapeView: {
    maxWidth: '100%',
    height: 40,
    padding: 10,
    marginVertical: 1,
    backgroundColor: '#f5da0b',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  }
});

export default Profile;