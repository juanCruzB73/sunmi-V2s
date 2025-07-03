import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceButton from '../../components/commerce/CommerceButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceMenu'>;

const CommerceScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient
        colors={['#f2f6fc', '#dde9f7']}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <CommerceButton label="Datos del comercio" />
          <CommerceButton label="Generar Factura" />
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
    alignItems: 'stretch',
    paddingBottom: 60,
  },
});

export default CommerceScreen;