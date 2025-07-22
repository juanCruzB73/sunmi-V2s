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
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IAnswer } from '../../types/claims/IAnswer';

type Props = NativeStackScreenProps<RootStackParamList, 'ClaimScreen'>;

export const ClaimScreen = ({ navigation }: Props) => {
  const { activeClaim } = useSelector((state: RootState) => state.claim);
  console.log(activeClaim);
  
  if (!activeClaim)return<><TopBar navigation={navigation} /><Text>No se selecciono Claim</Text></>
  
  //const countAnswers=activeClaim.answers.length;
  
  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f1f5fa', '#d8e4f4']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Datos de solicitud</Text>

          <View style={styles.card}>
            {activeClaim.answers.map((answer:IAnswer)=>(
              <Text>{answer.question.name}: {answer.input_string}</Text>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonConfirm,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('ClaimSearcher')}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.buttonConfirm,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('ClaimSearcher')}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
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