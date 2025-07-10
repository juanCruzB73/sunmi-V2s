import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import EmailInput from '../../components/forgotPassword/EmailInput';
import LoginButton from '../../components/login/LoginButton';
import { Dimensions } from 'react-native';
import { RootStackParamList } from '../../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNetworkStatus} from '../../utlis/useNetworkStatus';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ForgetPasswordScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const isOnline = useNetworkStatus();

  const handleSend = () => {
    if (!email.trim()) {
      Alert.alert('Correo vacío', 'Por favor ingresá tu correo electrónico.');
      return;
      
    }
      if (!isOnline) {
          Alert.alert('Sin conexión', 'Necesitas conexión a Internet para enviar el correo.');
          return;
        }
    Alert.alert('Recuperar contraseña', `Se enviará un correo a: ${email}`);
  };
//A IMPLEMENTAR
  const handleBack = ({navigation}:Props) => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
       <View style={styles.textContainer}>
         <Text style={styles.title}>¿Olvidó su contraseña?</Text>
          <Text style={styles.description}>
            Ingrese su email para recuperar su contraseña
          </Text>
       </View>

        <EmailInput value={email} onChangeText={setEmail} />
        <LoginButton label="Enviar" onPress={handleSend} />
      </View>
  </>
);
};

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    display:"flex",
    padding:20,
    backgroundColor: '#fff',
    width:width,
    height:height
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    padding: 8,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 17,
    marginTop: 12,
    marginBottom: 44,
    color: '#333',
  },
  textContainer:{
    display:"flex",
    alignItems:"center"
  }
});

export default ForgetPasswordScreen;