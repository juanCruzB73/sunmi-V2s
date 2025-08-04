import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { IAnswer } from '../../types/claims/IAnswer';
import { startLoadQuestionsByPanel } from '../../redux/slices/question/questionThunk';
import { startDeleteClaim } from '../../redux/slices/claims/claimThunk';
import { IClaim } from '../../types/claims/IClaim';
import { unSyncedClaim } from '../../types/unSyncedClaim';
import { unSyncedAnswer } from '../../types/unSyncedAnswer';

type Props = NativeStackScreenProps<RootStackParamList, 'ClaimScreen'>;

export const ClaimScreen = ({ navigation }: Props) => {
  const { activeForm } = useSelector((state: RootState) => state.form);
  const { activeClaim } = useSelector((state: RootState) => state.claim);
  const dispatch = useDispatch<AppDispatch>();

  function isIClaim(claim: IClaim | unSyncedClaim): claim is IClaim {
    return (claim as IClaim).answers !== undefined;
  }

  if (!activeClaim)
    return (
      <>
        <TopBar navigation={navigation} />
        <Text style={styles.emptyText}>No se seleccionó solicitud</Text>
      </>
    );

  if (!activeForm)
    return (
      <>
        <TopBar navigation={navigation} />
        <Text style={styles.emptyText}>No se seleccionó formulario</Text>
      </>
    );

  const handleClickEdit = () => {
    if (isIClaim(activeClaim)) {
      dispatch(startLoadQuestionsByPanel(activeForm.id, activeClaim.main_panel_id));
    }
  };

  const handleDeleteClaim = () => {
    if (isIClaim(activeClaim)) {
      dispatch(startDeleteClaim(activeClaim.id));
    }
  };

  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#eef2f7', '#d6e0f0']} style={styles.gradient}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Datos de la solicitud</Text>

          <View style={styles.card}>
            <ScrollView contentContainerStyle={styles.answersContainer}>
              {isIClaim(activeClaim)
                ? activeClaim.answers.map((answer: IAnswer) => (
                    <View key={answer.id} style={styles.answerRow}>
                      <Text style={styles.question}>
                        {answer.question?.name ?? 'Pregunta sin nombre'}:
                      </Text>
                      <Text style={styles.answer}>{answer.input_string}</Text>
                    </View>
                  ))
                : activeClaim.answers_attributes.map(
                    (answer: unSyncedAnswer, index) => (
                      <View key={index} style={styles.answerRow}>
                        <Text style={styles.question}>
                          Pregunta {answer.question_id}:
                        </Text>
                        <Text style={styles.answer}>{answer.input_string}</Text>
                      </View>
                    )
                  )}
            </ScrollView>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.editButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                handleClickEdit();
                navigation.navigate('DisplayQuestions');
              }}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                handleDeleteClaim();
                navigation.navigate('ClaimSearcher');
              }}
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
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 14,
    width: width * 0.9,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  answersContainer: {
    paddingBottom: 10,
  },
  answerRow: {
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  answer: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});