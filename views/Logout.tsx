import { Text, View } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

interface LoginScreenProps {
    navigation: any;
  }

const Logout: React.FC<LoginScreenProps> = (props) => { {
    const handleLogOut = async () => {
        await AsyncStorage.removeItem('authToken');
        props.navigation.navigate("Login");
      }

    useEffect(() =>{
        handleLogOut();
    }, []);

    return null;
}
}

export default Logout