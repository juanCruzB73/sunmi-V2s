import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions, TextInput } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'CommerceSearcher'>;

export const CommerceSearcher = ({ navigation }: Props) => {
  const [plateNumber, setPlateNumber] = useState('');
  const handlePlateChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z0-9]/g, '');
    setPlateNumber(filteredText);
  };

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f2f6fc', '#d7e3f4']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Buscador de Comercios</Text>
          <Text style={styles.description}>Ingrese el RUT del comercio</Text>
          <TextInput
            style={styles.input}
            value={plateNumber}
            onChangeText={handlePlateChange}
            placeholder="Ingrese RUT"
            placeholderTextColor="#777"
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={() => navigation.navigate('CommerceFineScreen')}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </>
  );
};

const { width, height } = Dimensions.get('window');

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
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.9,
    color: '#000',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    width: width * 0.9,
    alignItems: 'center',
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});