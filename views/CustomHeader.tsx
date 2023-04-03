import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface LoginScreenProps {
  navigation: any;
  title: any;
}



const CustomHeader: React.FC<LoginScreenProps> = (props) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.toggleDrawer()}>
        <FontAwesome name="bars" size={24} color="#f59e0b" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 30,
  },
});

export default CustomHeader;