import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceButton from '../../components/commerce/CommerceButton';

const CommerceScreen: React.FC = () => {
  return (<> 
  <TopBar />
    <View style={styles.container}>
      <CommerceButton label="Datos del comercio" onPress={() => {}} />
      <CommerceButton label="Generar Factura" onPress={() => {}} />
    </View>
  </>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
});

export default CommerceScreen;