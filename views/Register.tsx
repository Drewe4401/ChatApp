import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';

interface HomeProps {
  navigation: any;
}

const Register: React.FC<HomeProps> = (props) => {

  const [Email, setEmail] = useState('');
  const [FnameConfirm, setFnameConfirm] = useState('');
  const [Companyname, setCompanyname] = useState('');
  const [CompanyID, setCompanyID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selected, setSelected] = useState("");
  const [showInputEM, setShowInputEM] = useState(false);
  const [showInputCO, setShowInputCO] = useState(false);

  const data = [
    {key:'2', value:'Owner'},
]

  const handleRegister = () => {
        props.navigation.navigate({screen: 'Home'});   
  };
  
  return (
    <ScrollView style={styles.container}>
    <KeyboardAvoidingView keyboardVerticalOffset={-200} behavior="position" style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={Email}
          placeholder="Enter Email Address"
          autoCapitalize="none"
        />
         <TextInput
          style={styles.input}
          onChangeText={setFnameConfirm}
          value={FnameConfirm}
          placeholder="Enter Full Name"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0718C4',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Register;