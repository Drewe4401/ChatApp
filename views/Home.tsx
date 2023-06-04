import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text,TextInput, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import jwtDecode from "jwt-decode";
import { firebase } from '../config/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";


interface LoginScreenProps {
  navigation: any;
  route: any;
}

interface DecodedToken {
    email: string;
    // Add other properties you expect in the token here
}

interface Message{
    Email_Address: string;
    Username: string;
    profilePicture: string;
    lastMessage: string;
    date: firebase.firestore.Timestamp | null;
}

const Home: React.FC<LoginScreenProps> = (props) => {

    const [email, setEmail] = useState('');
    const [documents, setDocuments] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filteredDocuments, setFilteredDocuments] = useState<Message[]>([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [unsubscribeFunctions, setUnsubscribeFunctions] = useState<(() => void)[]>([]);


    const navigation = useNavigation();

    const handleProfile = () => {
      // Perform login logic (e.g., call an API or validate user credentials)
      props.navigation.toggleDrawer();
    };

    const handleSearch = () => {
      if (isSearchVisible) {
        setSearch('');
        const lowerCaseSearch = search.toLowerCase();
        const filtered = documents.filter(doc => doc.Username.toLowerCase().includes(lowerCaseSearch));
        setFilteredDocuments(filtered);
      }
      setIsSearchVisible(!isSearchVisible);
    };

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
        setIsLoading(true);
    
        const unsubscribes: (() => void)[] = [];
    
        const unsubscribe = firebase
          .firestore()
          .collection('users')
          .doc(email)
          .collection('messaging_users')
          .onSnapshot(async (snapshot) => {
            let fetchedDocuments: Message[] = await Promise.all(snapshot.docs.map(async (doc) => {
                const userDoc = await firebase.firestore().collection('users').doc(doc.data().Email_Address).get();
                const profilePicture = userDoc.data()?.profilePicture;
          
                const messagesUnsubscribe = firebase
                  .firestore()
                  .collection('users')
                  .doc(email)
                  .collection('messaging_users')
                  .doc(doc.data().Email_Address)
                  .collection('messages')
                  .orderBy('date', 'desc')
                  .limit(1)
                  .onSnapshot((messagesSnapshot) => {
                    if (!messagesSnapshot.empty) {
                        const lastMessage = messagesSnapshot.docs[0].data().message;
                        const lastMessageDate = messagesSnapshot.docs[0].data().date;
    
                        // This function will be called each time a new message is added
                        // Update the state with the new message
                        setDocuments((prevDocuments) => {
                          const newDocuments = [...prevDocuments];
                          const index = newDocuments.findIndex(
                            (d) => d.Email_Address === doc.data().Email_Address
                          );
                          if (index !== -1) {
                            newDocuments[index].lastMessage = lastMessage;
                            newDocuments[index].date = lastMessageDate;
                          }
                          return newDocuments;
                        });
                    }
                  });
                unsubscribes.push(messagesUnsubscribe);
    
                return { Email_Address: doc.data().Email_Address, Username: doc.data().Username, profilePicture, lastMessage: '', date: null };
            }));
    
            setDocuments(fetchedDocuments);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching documents:', error);
            setIsLoading(false);
        });
    
        return () => {
          // Unsubscribe from the "messaging_users" listener
          unsubscribe();
          // Unsubscribe from all "messages" listeners
          unsubscribes.forEach((unsub) => unsub());
        };
    };
    const formatDate = (date: firebase.firestore.Timestamp | null): string => {
      if (date === null) return '';
      const messageDate = date.toDate(); // Convert to Date
      const today = new Date(); // Get current date
    
      const sameDay = today.getFullYear() === messageDate.getFullYear() &&
                      today.getMonth() === messageDate.getMonth() &&
                      today.getDate() === messageDate.getDate();
    
      if (sameDay) {
        // Return the time if the message was sent today
        let hours = messageDate.getHours();
        const minutes = messageDate.getMinutes();
    
        let period = 'AM';
        if (hours >= 12) {
          period = 'PM';
          if (hours > 12) hours -= 12; // convert to 12-hour format
        } else if (hours === 0) {
          hours = 12; // convert 0 hours (midnight) to 12
        }
    
        // Convert hours and minutes to strings and prepend 0 to minutes if they're less than 10
        const hoursString = '' + hours;
        const minutesString = minutes < 10 ? '0' + minutes : '' + minutes;
    
        return `${hoursString}:${minutesString} ${period}`;
      } else {
        // Return the date if the message was not sent today
        return messageDate.toLocaleDateString();
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

  const handleSearchExecution = () => {
    const lowerCaseSearch = search.toLowerCase();
    const filtered = documents.filter(doc => doc.Username.toLowerCase().includes(lowerCaseSearch));
    setFilteredDocuments(filtered);
};

React.useLayoutEffect(() => {
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
}, [navigation, isSearchVisible]);



    const renderItem = ({ item }: { item: Message }) => (
      <View style={styles.combineContainer}>
          <TouchableOpacity style={styles.pictureContainer} onPress={() => props.navigation.navigate('ProfileView', {item})}>
              {item.profilePicture && <Image source={{ uri: item.profilePicture }} style={{ width: '100%', height: '100%', borderRadius:40 }} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.fancyContainer} onPress={() => props.navigation.navigate('Chat', {email: item.Email_Address})}>
              <View>
                <View style={styles.headerContainer}> 
                  <Text style={styles.itemText}>{item.Username}</Text>
                  <Text style={styles.lastMessageDate}>{formatDate(item.date)}</Text>
                </View>
                <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
              </View>
          </TouchableOpacity>
      </View>
    );
    

    return (
      <View style={styles.container}>
      {isLoading ?
        <ActivityIndicator size="large" color="gray" /> :
        <View>
          {isSearchVisible && 
    <TextInput
        value={search}
        onChangeText={setSearch}
        onEndEditing={handleSearchExecution}
        style={styles.searchInput}
        placeholder="Search..."
    />
}
<FlatList
    data={filteredDocuments.length > 0 ? filteredDocuments : documents}
    renderItem={renderItem}
    keyExtractor={item => item.Email_Address}
/>
        </View>
      }

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
      searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
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
          flex: 1
        },
        lastMessageDate: {
          fontSize: 12,
          color: '#aaa',
        },
        lastMessageText: {
          color: '#666',
          fontSize: 16,
        },
        headerContainer: {  
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center'
        },
        combineContainer:{
          flexDirection: "row",
        } , 
        pictureContainer: {
          top: 5,
          left: 5,
          backgroundColor: 'gray',
          height: 68,
          width: 68,
          marginVertical: 1,
          borderRadius: 35,
          borderWidth: 2,
          borderColor: 'black',
        },

        fancyContainer: {
          maxWidth: '100%',
          height: 80,
          left: 5,
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