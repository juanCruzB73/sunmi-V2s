import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrintingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Imprimiendo...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 }
});

export default PrintingScreen;