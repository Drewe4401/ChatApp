import React, {useState, useEffect,Component} from 'react';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  Text,
  Image,
  KeyboardAvoidingView,
  Alert,
  ImageBackground,
  Dimensions,
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

  ///////////////////////////

  ///////////////////////////

  const registera = () => props.navigation.navigate("Register")

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={-200} behavior="position" >
      <ImageBackground style={{height:Dimensions.get('window').height /2.22 ,width:'100%'}}
       source={require('../assets/background2.png')}>
      <View></View>
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
          colors={['#f3322f', '#f44a47', '#f5625f','#f77977','#f8918f']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity style={styles.registerlo} onPress={registera}>
          <Text style={styles.registertext}>Don't have an account?
            <Text style={styles.registertext2}> Register Now!</Text>
          </Text> 
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
    borderColor: '#f5625f',
    backgroundColor:'#F5FCFF',
    borderRadius :100,
    borderWidth: 2,
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
    color: '#6b615f',
    alignItems: 'center',
    marginTop: 20,

    
  },
  registertext2:{
    fontSize: 18,
    fontStyle: 'italic',
    color: '#f5625f',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    
  },
  bottomView:{
    flex: 1.5,
    backgroundColor: '#ffffff',
    bottom: 50,
    borderTopStartRadius:60,
    borderBottomEndRadius:60,
  }
});

const styles2 = StyleSheet.create({   // style for email address input
  
  inputContainer: {
    paddingHorizontal: 20,
  },

  input: {
    height: 60,
    fontSize: 14,
    borderColor: '#f5625f',
    backgroundColor:'#F5FCFF',
    borderRadius :100,
    borderWidth: 2,
    marginBottom: 20,
    marginTop: 43,
    paddingHorizontal: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
})

export default Login;