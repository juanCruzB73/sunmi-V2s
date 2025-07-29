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
import { startAddClaim, startEditClaim } from '../redux/slices/claims/claimThunk';

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayQuestions'>;

export const DisplayQuestions = ({ navigation }: Props) => {

    const { activeForm } = useSelector((state: RootState) => state.form);
    const { questions } = useSelector((state: RootState) => state.question);
    const { activeClaim } = useSelector((state: RootState) => state.claim);

    const dispatch = useDispatch<AppDispatch>();

    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [mainPanel,setMainPanel]=useState<number|null>(null);
    const [optionSelected, setOptionSelected] = useState<number|null>(null);

    const handleChange = (questionId: number, newValue: any) => {
      setAnswers((prev) => {
        if (activeClaim) {
          const existing = prev[questionId];
          return {
            ...prev,
            [questionId]: {
              id: existing?.id,
              input_string: newValue,
              question_id: questionId
            }
          };
        } else {
          return {
            ...prev,
            [questionId]: newValue
          };
        }
      });
    };

    const handleNextPanel = async (panelId: number|null) => {
      panelId&&dispatch(startLoadQuestionsByPanel(activeForm!.id, panelId));
    };

    const handleSaveOptionSelected=(option:number|null)=>{
      setOptionSelected(option);
    };

    const handleSubmit = () => {
    const answersArray = Object.entries(answers).map(([questionId, value]) => {
      if (activeClaim) {
        return {
          id: value.id,
          input_string: String(value.input_string),
          question_id: String(value.question_id)
        };
      } else {
        return {
          input_string: String(value),
          question_id: String(questionId)
        };
      }
    });

    const data = !activeClaim ? 
    {
      claim: {
        form_id: activeForm!.id,
        incident_id: activeForm!.incident_id,
        area_id: activeForm!.area_id,
        main_panel_id: mainPanel,
        answers_attributes: answersArray
      }
    }:
    {
      claim: {
        id:activeClaim.id,
        form_id: activeForm!.id,
        incident_id: activeForm!.incident_id,
        mainPanel:activeClaim.main_panel_id,
        area_id: activeForm!.area_id,
        answers_attributes: answersArray
      }
    };
    console.log('FINAL DATA TO SEND:', JSON.stringify(data, null, 2));
    if (!activeClaim) dispatch(startAddClaim(data));
    if (activeClaim) dispatch(startEditClaim(data));
    navigation.navigate('ClaimSearcher');
  };


  useEffect(() => {
    if (activeClaim) {
      const mappedAnswers = activeClaim.answers.reduce((acc: Record<number, any>, ans: any) => {
        acc[ans.question_id] = {
          id: ans.id,
          input_string: ans.input_string,
          question_id: ans.question_id
        };
        return acc;
      }, {});
      setAnswers(mappedAnswers);
    }
  }, [activeClaim]);

  useEffect(()=>{
    if(questions.length>0){
      setMainPanel(questions[0].panel_id);
    };
  },[questions])

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
              value: activeClaim
                ? answers[question.id]?.input_string ?? ''
                : answers[question.id] ?? '',
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