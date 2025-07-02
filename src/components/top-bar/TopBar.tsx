import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../router/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type TopBarProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'|'CommerceMenu'|'VehicleScreen'|'FineSearcher'|'VehicleFineModal'|'CommerceFineModal'>;
};
export const TopBar = ({ navigation }: TopBarProps) => {
  
  return (
    <View style={styles.container}>
      <FontAwesome name="bars" size={30} style={styles.icon} />
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('../../assets/logoOriginal.jpeg')}
          style={{ width: 140, height: 50 }}
        />
      </TouchableOpacity>
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