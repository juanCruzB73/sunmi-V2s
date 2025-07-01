import React from 'react'
import { View, Image, StyleSheet, Alert, Text, TouchableOpacity  } from 'react-native';
import { Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const TopBar = () => {
  return (
      <View style={styles.container}>
        <FontAwesome name="bars" size={20} color="#888" style={styles.icon} />
        <Image
            source={require('../../assets/logoOriginal.jpeg')}
            style={{ width: 140, height: 50 }}
        />
      </View>
    );
}

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection:"row",
    paddingBlock:10,
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor:"fff",
    padding: 10,
    alignSelf: 'stretch',
    maxHeight:height * 0.2,
    minWidth:width
  },
  icon:{
    color:"balck",
    fontSize:30
  }
});
