import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceButton from '../../components/commerce/CommerceButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceMenu'>;

const CommerceScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <View style={styles.container}>
        <CommerceButton
          label="Datos del comercio"       />
        <CommerceButton
          label="Generar Factura"         />
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