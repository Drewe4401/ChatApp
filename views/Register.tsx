import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Image,
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

  const Logina = () => props.navigation.navigate("Login")
  

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={400} behavior="position" >
      <ImageBackground style={{height:Dimensions.get('window').height /2.7 ,width:'100%'}}
       source={require('../assets/background2.png')}>
      <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
         style={{
          resizeMode: 'contain',
          alignSelf:'center',
          height: '50%',
          width: '100%',
          bottom:'10%',
        }}
        source={require('../assets/whitelogo.png')}/>
        <View style={{top: '6%',}}>
        <TextInput
          style={styles2.input}
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
          placeholder="Enter Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Enter Confirm Password"
          secureTextEntry
        />
        <LinearGradient
          colors={['#f3322f', '#f44a47', '#f5625f','#f77977','#f8918f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register!</Text>
        </TouchableOpacity>
        </LinearGradient>
        <View style={styles.registerlo}>
        <Text style={styles.registertext}>Already have an account?</Text>
      <TouchableOpacity onPress={Logina}>
          <Text style={styles.registertext2}> Login!</Text>
      </TouchableOpacity>
      </View>
      </View>
      </View>
      </View>
      <View style={styles.bottomView}><Text style={styles.welcometext}>Register Here!</Text></View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '20%',
  },
  inputContainer: {
    paddingHorizontal: '6%',
    
  },
  input: {
    height: '10%',
    fontSize: 15,
    borderColor: '#f5625f',
    backgroundColor:'#F5FCFF',
    borderRadius :100,
    borderWidth: 2,
    marginBottom: '7%',
    paddingHorizontal: '10%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  button: {
    paddingVertical: '7%',
    paddingHorizontal: '10%',
    borderRadius: 5,
    alignItems: 'center',
  },
  registerlo: {
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  registertext: {
    fontSize: 18,
    color: '#6b615f',
    alignItems: 'center',
    marginTop: '-8%',
    marginBottom: '10%'
  },
  registertext2:{
    fontSize: 18,
    fontStyle: 'italic',
    color: '#f5625f',
    alignItems: 'center',
    marginTop: '-85%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom:'1%'
    
  },
  welcometext: {
    color: '#f5625f',
    fontWeight: 'bold',
    fontSize: 45,
    justifyContent: 'center',
    top: '30%',
    
  },
  bottomView:{
    height: '20%',
    backgroundColor: '#f2f2f2',
    borderTopStartRadius:60,
    alignItems: 'center',
    borderTopEndRadius:60,
  }
});

const styles2 = StyleSheet.create({   // style for email address input
  
  inputContainer: {
    paddingHorizontal: 20,
  },

  input: {
    height: '10%',
    fontSize: 15,
    borderColor: '#f5625f',
    backgroundColor:'#F5FCFF',
    borderRadius :100,
    borderWidth: 2,
    marginBottom: '7%',
    marginTop: '15%',
    paddingHorizontal: '10%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
})

export default Register;