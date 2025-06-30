import React from 'react'
import { View, Image, StyleSheet, Alert, Text, TouchableOpacity  } from 'react-native';
import { Dimensions } from 'react-native';

export const TopBar = () => {
  return (
      <View style={styles.container}>
        <Image
            source={require('../../assets/logoNoLetter.jpeg')}
            style={{ width: 50, height: 50 }}
        />

      </View>
    );
}

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor:"#1664C0",
    padding: 10,
    alignSelf: 'stretch',
    maxHeight:height * 0.1
  },
});
