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

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayQuestions'>;

export const DisplayQuestions = ({ navigation }: Props) => {

    const { activeForm } = useSelector((state: RootState) => state.form);
    const { questions } = useSelector((state: RootState) => state.question);

    const dispatch = useDispatch<AppDispatch>();

    const [answers, setAnswers] = useState<Record<number, any>>({});

    const [questionsToDisplay,setQuestionsTodisplay]=useState<IQuestion[]>([]);

    const handleChange = (questionId: number, newValue: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: newValue }));
    };

    const handleNextPanel=(panelId:number)=>{
      dispatch(startLoadQuestionsByPanel(activeForm!.id,panelId))
    }

    useEffect(()=>{
      if (!Array.isArray(questions)) return;
      const filtered = questions.filter((q: IQuestion) =>
        Array.isArray(q.question_options) && q.question_options.length > 0
      );
      if (filtered.length > 0) {
        setQuestionsTodisplay(filtered);
      } else {
        setQuestionsTodisplay(questions);
      }
    },[questions])

    if (!Array.isArray(questions)) {
        return <Text style={{ padding: 20 }}>Loading questions...</Text>;
    }
    return (
    <ScrollView>
      <TopBar navigation={navigation} />

      {questionsToDisplay.map((question: IQuestion) => (
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
