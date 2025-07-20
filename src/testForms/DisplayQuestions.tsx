import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { TopBar } from '../components/top-bar/TopBar';
import { RootStackParamList } from '../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IQuestion } from '../types/form/IQuestion';
import QuestionInput from '../components/question-option/QuestionInput';
import { startLoadQuestionsByPanel } from '../redux/slices/question/questionThunk';
import { startOfflineQuestionsByPanel } from '../redux/slices/offline/questionsOffline';
import NetInfo from '@react-native-community/netinfo';


type Props = NativeStackScreenProps<RootStackParamList, 'DisplayQuestions'>;

export const DisplayQuestions = ({ navigation }: Props) => {

    const { activeForm } = useSelector((state: RootState) => state.form);
    const { questions } = useSelector((state: RootState) => state.question);

    const dispatch = useDispatch<AppDispatch>();

    const [answers, setAnswers] = useState<Record<number, any>>({});

    //const [questionsToDisplay,setQuestionsTodisplay]=useState<IQuestion[]>([]);

    const handleChange = (questionId: number, newValue: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: newValue }));
    };

    const handleNextPanel = async (panelId: number) => {
  const netState = await NetInfo.fetch();

  if (netState.isConnected) {
    await dispatch(startLoadQuestionsByPanel(activeForm!.id, panelId));
  } else {
    await dispatch(startOfflineQuestionsByPanel(panelId));
  }
}

    if (!Array.isArray(questions)) {
        return <Text style={{ padding: 20 }}>Loading questions...</Text>;
    };

    return (
    <ScrollView>
      <TopBar navigation={navigation} />

      {questions.map((question: IQuestion) => (
        <View key={question.id} style={{ margin: 10 }}>
          <QuestionInput
            question={{
              type: question.type,
              label: question.name,
              options: question.question_options ?? [],
              value: answers[question.id] || '',
              onChange: (val) => handleChange(question.id, val),
              onPressFunction:(value) => {
                if (value?.panel_id) {
                  handleNextPanel(value?.panel_id)
                } else {
                  console.log('No next panel');
                }
              }
            }}
          />
        </View>
      ))}
    </ScrollView>
  )
}
