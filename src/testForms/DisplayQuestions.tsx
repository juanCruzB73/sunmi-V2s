import React, { useEffect, useState } from 'react'
import { Button, ScrollView, Text, View } from 'react-native'
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
    const [optionSelected, setOptionSelected] = useState<number|null>(null);

    //const [questionsToDisplay,setQuestionsTodisplay]=useState<IQuestion[]>([]);

    const handleChange = (questionId: number, newValue: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: newValue }));
    };

    const handleNextPanel = async (panelId: number|null) => {
      const netState = await NetInfo.fetch();

      if (netState.isConnected) {
        panelId&&await dispatch(startLoadQuestionsByPanel(activeForm!.id, panelId));
      } else {
        panelId&&await dispatch(startOfflineQuestionsByPanel(panelId));
      }
    };

    const handleSaveOptionSelected=(option:number|null)=>{
      setOptionSelected(option);
      console.log(optionSelected)
    };

    if (!Array.isArray(questions)) {
        return <Text style={{ padding: 20 }}>Loading questions...</Text>;
    };

    const handleSubmit=()=>{
      console.log("submited");
    }

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
              onPressFunction:(val) => {handleSaveOptionSelected(val)}
            }}
          />
          {
          question.question_options&&question.question_options.length>0&&
          <Button
            title="Siguiente Panel"
            onPress={() => handleNextPanel(optionSelected)}
          />
          }
        </View>
      ))}
      {
        <Button
            title="Enviar"
            onPress={() => handleSubmit()}
          />
      }
    </ScrollView>
  )
}
