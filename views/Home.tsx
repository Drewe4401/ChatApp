import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';

interface LoginScreenProps {
  navigation: any;
}

const Home: React.FC<LoginScreenProps> = (props) => {

    const navigation = useNavigation();

    const handleProfile = () => {
      // Perform login logic (e.g., call an API or validate user credentials)
      props.navigation.navigate("Profile");
    };

    

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <FontAwesome name="search" size={24} color={colors.logocolor} style={{marginLeft: 15}}/>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleProfile}>
                <FontAwesome name='user' size={24} color={colors.logocolor} style={{marginRight: 15}}/>
              </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => props.navigation.navigate("Chat")}
                style={styles.chatButton}
            >
                <Entypo name="chat" size={24} color={colors.lightGray} />
            </TouchableOpacity>
        </View>
    );
    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: "#fff",
        },
        chatButton: {
            backgroundColor: colors.primary,
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .9,
            shadowRadius: 8,
            marginRight: 20,
            marginBottom: 50,
        }
    });