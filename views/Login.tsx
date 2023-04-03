import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Alert,
  ImageBackground,
} from 'react-native';
import { auth } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient';



interface LoginScreenProps {
  navigation: any;
}

const Login: React.FC<LoginScreenProps> = (props) => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic (e.g., call an API or validate user credentials)


    signInWithEmailAndPassword(auth, Email, password)
        .then(async (credentials) => {const token = await credentials.user.getIdToken();console.log("SignIn was a Success"); AsyncStorage.setItem('authToken', token);console.log(token);props.navigation.navigate("DrawerNavigator", {screen: 'Home'});})
        .catch((err) => Alert.alert("Login error", err.message));
  };


  useEffect(() => {

  }, []);



  const registera = () => props.navigation.navigate("Register")

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={-200} behavior="position" >
      <ImageBackground style={{height:'100%',width:'100%'}} source={require('../assets/background2.png')}>
      <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
         style={{
          resizeMode: 'contain',
          alignSelf:'center',
          height: 200,
          width: 400,
        }}
        source={require('../assets/whitelogo.png')}/>
        <TextInput
          style={styles2.input}
          onChangeText={setEmail}
          value={Email}
          placeholder="Enter Email Address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <LinearGradient
          colors={['#f59e0b', '#f7b444', '#facb7c','#fce1b5']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity style={styles.registerlo} onPress={registera}>
          <Text style={styles.registertext}>Don't have an account? Click here to Register.</Text>
      </TouchableOpacity>
      </View>
      </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 150,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 60,
    fontSize: 14,
    borderColor: '#ffcc73',
    backgroundColor:'#F5FCFF',
    borderRadius :100,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  button: {
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerlo: {
    marginTop: 10,
    alignItems: 'center',
  },
  registertext: {
    fontSize: 18,
    color: '#2196F3',
    alignItems: 'center',
    marginTop: 20,

    
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    
  },
});

const styles2 = StyleSheet.create({   // style for email address input
 
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 60,
    fontSize: 14,
    borderColor: '#ffcc73',
    backgroundColor:'#F5FCFF',
    borderRadius :100,
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
})

export default Login;