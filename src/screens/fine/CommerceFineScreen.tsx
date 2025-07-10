import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceFineScreen'>;

const CommerceFineScreen = ({ navigation }: Props) => {
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Confirmar datos del comercio</Text>

          <View style={styles.card}>
            <Text style={styles.plate}>ASDW0000</Text>
            {[
              'Registro comercial:',
              'Tipo de comercio:',
              'Comuna:',
              'Calle:',
              'Numeración:',
              'Licencia de comercio:',
              'Infracciones anteriores:'
            ].map((label, idx) => (
              <Text key={idx} style={styles.field}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonGoBack,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('VehicleSearcher')}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.buttonConfirm,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('FineSearcher')}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
  },
  plate: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f5f7fa',
    padding: 20,
    borderRadius: 12,
    width: width * 0.9,
    gap: 10,
    elevation: 2,
  },
  field: {
    fontSize: 18,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 24,
  },
  buttonGoBack: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CommerceFineScreen;