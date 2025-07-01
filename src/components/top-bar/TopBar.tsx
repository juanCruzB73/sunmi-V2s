import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Exportación nombrada y por defecto para máxima compatibilidad
export const TopBar = () => {
  return (
    <View style={styles.container}>
      <FontAwesome name="bars" size={30} style={styles.icon} />
      <Image
        source={require('../../assets/logoOriginal.jpeg')}
        style={{ width: 140, height: 50 }}
      />
    </View>
  );
};

// Exportación por defecto opcional (descomenta si quieres importar como default)
// export default TopBar;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    alignSelf: 'stretch',
    maxHeight: height * 0.2,
    minWidth: width,
  },
  icon: {
    fontSize: 30,
    marginRight: 10,
  },
});