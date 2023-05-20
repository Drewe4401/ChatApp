import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, FlatList, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import jwtDecode from "jwt-decode";
import { firebase } from '../config/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";


interface LoginScreenProps {
  navigation: any;
}

interface DecodedToken {
    email: string;
    // Add other properties you expect in the token here
}

interface Message{
    Email_Address: string;
    Username: string;
}

const Home: React.FC<LoginScreenProps> = (props) => {

    const [email, setEmail] = useState('');
    const [documents, setDocuments] = useState<Message[]>([]);

    const navigation = useNavigation();

    const handleProfile = () => {
      // Perform login logic (e.g., call an API or validate user credentials)
      props.navigation.toggleDrawer();
    };

    const handleSearch = () => {
        //needs to me programmed

    }

    const getEmailFromAuthToken = async () => {
        try {
          const authToken = await AsyncStorage.getItem('authToken');
    
          if (authToken) {
            const decodedToken = jwtDecode(authToken) as DecodedToken;
            setEmail(decodedToken.email.toLowerCase());
            return decodedToken.email.toLowerCase();
          } else {
            console.log('No auth token found');
            return null;
          }
        } catch (error) {
          console.log('Error getting email from auth token:', error);
          return null;
        }
      };

      const fetchData = async (email: string) => {
        try {
          const collectionName = 'users';
          const snapshot = await firebase
            .firestore()
            .collection(collectionName)
            .doc(email)
            .collection('messaging_users')
            .onSnapshot((snapshot) => {
                const fetchedDocuments: Array<{ Email_Address: string; Username: string }> = [];
    
                snapshot.forEach((doc) => {
                    fetchedDocuments.push({ Email_Address: doc.data().Email_Address, Username: doc.data().Username });
                });
    
                setDocuments(fetchedDocuments);
            });
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };
    
      useEffect(() => {
        let unsubscribe: any;
        getEmailFromAuthToken().then((email) => {
            if (email) {
                unsubscribe = fetchData(email);
            }
        });
    
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
            <TouchableOpacity style={styles.leftbutton} onPress={handleProfile}>
                <FontAwesome name='bars' size={24} color={colors.blackcolor} style={{marginRight: 15}}/>
            </TouchableOpacity>
            ),
            headerRight: () => (
            <TouchableOpacity style={styles.rightbutton} onPress={handleSearch}>
                <FontAwesome name="search" size={24} color={colors.blackcolor} style={{marginLeft: 15}}/>
            </TouchableOpacity>
            ),
        });
    }, [navigation]);



    const renderItem = ({ item }: { item: Message }) => (
        <View>
          <TouchableOpacity style={styles.fancyContainer} onPress={() => props.navigation.navigate('Chat', {item})}>
            <Text style={styles.itemText}>Email: {item.Email_Address}</Text>
            <Text style={styles.itemText}>Name: {item.Username}</Text>
          </TouchableOpacity>
        </View>
      );
    

    return (
        <View style={styles.container}>
            <FlatList
                data={documents}
                renderItem={renderItem}
                keyExtractor={item => item.Email_Address}
            />
            <TouchableOpacity
                onPress={() => props.navigation.navigate("ChatView")}
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
        itemText: {
            color: '#FFF',
            fontSize: 14,
          },
        fancyContainer: {
            backgroundColor: '#007BFF',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 100,
            marginVertical: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
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