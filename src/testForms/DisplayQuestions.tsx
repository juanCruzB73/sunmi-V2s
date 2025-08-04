import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { TopBar } from '../components/top-bar/TopBar';
import { RootStackParamList } from '../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IQuestion } from '../types/form/IQuestion';
import QuestionInput from '../components/question-option/QuestionInput';
import { startLoadQuestionsByPanel } from '../redux/slices/question/questionThunk';
import { startAddClaim, startEditClaim } from '../redux/slices/claims/claimThunk';
import { ClaimType } from '../redux/slices/claims/claimSlice';
import { IClaim } from '../types/claims/IClaim';

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayQuestions'>;

export const DisplayQuestions = ({ navigation }: Props) => {
  const { activeForm } = useSelector((state: RootState) => state.form);
  const { questions } = useSelector((state: RootState) => state.question);
  const { activeClaim } = useSelector((state: RootState) => state.claim);

  const dispatch = useDispatch<AppDispatch>();

  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [mainPanel, setMainPanel] = useState<number | null>(null);
  const [optionSelected, setOptionSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (questionId: number, newValue: any) => {
    setAnswers((prev) => {
      if (activeClaim) {
        const existing = prev[questionId];
        return {
          ...prev,
          [questionId]: {
            id: existing?.id,
            input_string: newValue,
            question_id: questionId,
          },
        };
      } else {
        return {
          ...prev,
          [questionId]: newValue,
        };
      }
    });
  };

  const handleNextPanel = async (panelId: number | null) => {
    panelId && dispatch(startLoadQuestionsByPanel(activeForm!.id, panelId));
  };

  const handleSaveOptionSelected = (option: number | null) => {
    setOptionSelected(option);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const answersArray = Object.entries(answers).map(([questionId, value]) => {
      if (activeClaim) {
        return {
          id: value.id,
          input_string: String(value.input_string),
          question_id: String(value.question_id),
        };
      } else {
        return {
          input_string: String(value),
          question_id: String(questionId),
        };
      }
    });

    const data = !activeClaim
      ? {
          claim: {
            form_id: activeForm!.id,
            incident_id: activeForm!.incident_id,
            area_id: activeForm!.area_id,
            main_panel_id: mainPanel,
            answers_attributes: answersArray,
          },
        }
      : {
          claim: {
            id: activeClaim.id,
            form_id: activeForm!.id,
            incident_id: activeForm!.incident_id,
            mainPanel: activeClaim.main_panel_id,
            area_id: activeForm!.area_id,
            answers_attributes: answersArray,
          },
        };

    if (!activeClaim) await dispatch(startAddClaim(data));
    if (activeClaim) await dispatch(startEditClaim(data));

    setLoading(false);
    navigation.navigate('ClaimSearcher');
  };

  function isIClaim(claim: ClaimType): claim is IClaim {
    return (claim as IClaim).answers !== undefined;
  }

  useEffect(() => {
    if (questions.length > 0) {
      setMainPanel(questions[0].panel_id);
    }
  }, [questions]);

  useEffect(() => {
    if (!activeClaim) return;

    if (isIClaim(activeClaim)) {
      const mappedAnswers = activeClaim.answers.reduce(
        (acc: Record<number, any>, ans: any) => {
          acc[ans.question_id] = {
            id: ans.id,
            input_string: ans.input_string,
            question_id: ans.question_id,
          };
          return acc;
        },
        {}
      );
      setAnswers(mappedAnswers);
    } else {
      const mappedAnswers = activeClaim.answers_attributes.reduce(
        (acc: Record<number, any>, ans: any) => {
          acc[ans.question_id] = {
            input_string: ans.input_string,
            question_id: ans.question_id,
          };
          return acc;
        },
        {}
      );
      setAnswers(mappedAnswers);
    }
  }, [activeClaim]);

  if (!Array.isArray(questions)) {
    return <Text style={{ padding: 20 }}>Loading questions...</Text>;
  }

  return (
    <ScrollView style={styles.scroll}>
      <TopBar navigation={navigation} />
      <View style={styles.container}>
        {questions.map((question: IQuestion) => (
          <View key={question.id} style={styles.card}>
            <QuestionInput
              question={{
                type: question.type,
                label: question.name,
                options: question.question_options ?? [],
                value: activeClaim
                  ? answers[question.id]?.input_string ?? ''
                  : answers[question.id] ?? '',
                onChange: (val) => handleChange(question.id, val),
                onPressFunction: (val) => {
                  handleSaveOptionSelected(val);
                },
              }}
            />
            {question.question_options &&
              question.question_options.length > 0 && (
                <TouchableOpacity
                  style={styles.panelButton}
                  onPress={() => handleNextPanel(optionSelected)}
                >
                  <Text style={styles.panelButtonText}>Siguiente Panel</Text>
                </TouchableOpacity>
              )}
          </View>
        ))}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#f5f6fa',
  },
  container: {
    padding: 16,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  panelButton: {
    marginTop: 12,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  panelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DisplayQuestions;