import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PrintingScreen = () => (
  <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={styles.gradient}>
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3498db" style={{ marginBottom: 20 }} />
      <Text style={styles.text}>Imprimiendo documento...</Text>
    </View>
  </LinearGradient>
);

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: width * 0.8,
  },
});

export default PrintingScreen;