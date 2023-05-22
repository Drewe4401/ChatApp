import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

interface DecodedToken {
  email: string;
  // Add other properties you expect in the token here
}


export default function UploadImage() {
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);

      // Convert image to base64
      let base64Image = `data:image/jpg;base64,${result.assets[0].base64}`;


      // Update base64 image in Firestore
      const userRef = firebase.firestore().collection('users').doc(email);
      await userRef.update({
        profilePicture: base64Image,
      });
    }
  };

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

  useEffect(() => {
    const fetchImage = async () => {
      const userRef = firebase.firestore().collection('users').doc(email);
      const doc = await userRef.get();

      if (!doc.exists) {
        console.log('No such document!');
      } else {
        setImage(doc.data()?.profilePicture || null);
      }
    };

    if (email) {
      fetchImage();
    }
  }, [email]);


  return (
    <View style={imageUploaderStyles.container}>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
    bottom: '80%',
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});