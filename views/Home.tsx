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
      props.navigation.toggleDrawer();
    };

    

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
            <TouchableOpacity style={styles.leftbutton} onPress={handleProfile}>
                <FontAwesome name='bars' size={24} color={colors.blackcolor} style={{marginRight: 15}}/>
            </TouchableOpacity>
            ),
            headerRight: () => (
            <TouchableOpacity style={styles.rightbutton} onPress={handleProfile}>
                <FontAwesome name="search" size={24} color={colors.blackcolor} style={{marginLeft: 15}}/>
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
            backgroundColor: colors.blackcolor,
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 20,
            marginBottom: 50,
        },
        leftbutton: {
            alignItems: 'center',
            marginLeft: 15,
            marginTop: 15,
        },
        rightbutton: {
            alignItems: 'center',
            marginRight: 15,
            marginTop: 15,
        },
    });