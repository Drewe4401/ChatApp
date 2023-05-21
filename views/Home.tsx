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

      const fetchData = (email: string): (() => void) => {
        const collectionName = 'users';
    
        const unsubscribe = firebase
          .firestore()
          .collection(collectionName)
          .doc(email)
          .collection('messaging_users')
          .onSnapshot((snapshot) => {
              const fetchedDocuments: Message[] = [];
    
              snapshot.forEach((doc) => {
                  fetchedDocuments.push({ Email_Address: doc.data().Email_Address, Username: doc.data().Username });
              });
    
              setDocuments(fetchedDocuments);
          }, (error) => {
              console.error('Error fetching documents:', error);
          });
    
        return unsubscribe;  // Returning the function to unsubscribe from the snapshot listener
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
          <View style={styles.combineContainer}>
          <TouchableOpacity style={styles.pictureContainer} onPress={() => props.navigation.navigate('Chat', {item})}>

          </TouchableOpacity>
          <TouchableOpacity style={styles.fancyContainer} onPress={() => props.navigation.navigate('Chat', {item})}>
            <Text style={styles.itemText}>{item.Username}</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    

    return (
        <View style={styles.container}>
          <View>
            <FlatList
                data={documents}
                renderItem={renderItem}
                keyExtractor={item => item.Email_Address}
            />
            </View>
            <View style={styles.container_button}>
            <TouchableOpacity
                onPress={() => props.navigation.navigate("ChatView")}
                style={styles.chatButton}
            >
                <Entypo name="chat" size={24} color={colors.lightGray} />
            </TouchableOpacity>
            </View>
        </View>
    );
    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        container_button: {
          position: 'absolute',
          marginTop: '175%',
          marginLeft: '85%',
      },
        chatButton: {
            backgroundColor: colors.blackcolor,
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
        },
        itemText: {
            color: '#000',
            fontSize: 20,
          },
        
        combineContainer:{
          flexDirection: "row",
        } , 
        pictureContainer: {
          backgroundColor: 'gray',
          height: 80,
          padding: 10,
          marginVertical: 1,
          flexBasis:80,
        },

        fancyContainer: {
          maxWidth: '100%',
          height: 80,
          padding: 10,
          marginVertical: 1,
          backgroundColor: '#FFFFFF',
          borderBottomColor: 'gray',
          borderBottomWidth: 2,
          flex:1
          
         
          
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