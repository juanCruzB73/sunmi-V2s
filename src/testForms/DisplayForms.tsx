import React from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { IForm } from '../types/form/IForm';
import { FormCard } from './FormCard';
import { TopBar } from '../components/top-bar/TopBar';
import { RootStackParamList } from '../router/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { onSetActiveForm } from '../redux/slices/form/formSlice';
import { startLoadQuestions } from '../redux/slices/question/questionThunk';
import { onLoadQuestions } from '../redux/slices/question/questionSlice';
import NetInfo from '@react-native-community/netinfo';
import { startOfflineQuestions } from '../redux/slices/question/offlineQuestionThunk';
import { IQuestion } from '../types/form/IQuestion';

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayForms'>;

export const DisplayForms = ({ navigation }: Props) => {
    const { forms } = useSelector((state: RootState) => state.form);
    const { questions } = useSelector((state: RootState) => state.question);
    
    const dispatch = useDispatch<AppDispatch>();

const handlePress = (form: IForm) => {
  const getQuestions = async () => {
    const netState = await NetInfo.fetch();

    let loadedQuestions: IQuestion[] = [];

    if (netState.isConnected) {
      const result = await dispatch(startLoadQuestions(form.id));
      if ('payload' in result! && Array.isArray(result.payload)) {
        loadedQuestions = result.payload;
      }
    } else {
      const result = await dispatch(startOfflineQuestions(form.id));
      if ('payload' in result! && Array.isArray(result.payload)) {
        loadedQuestions = result.payload;
      }
    }

    const filtered = loadedQuestions.filter(
      (q) => Array.isArray(q.question_options) && q.question_options.length > 0
    );

    dispatch(onLoadQuestions(filtered));
    dispatch(onSetActiveForm(form));
    navigation.navigate("DisplayQuestions");
  };

  getQuestions();
};

    if (!Array.isArray(forms)) {
        return <Text style={{ padding: 20 }}>Loading questions...</Text>;
    };

    return (
    <View>
        <TopBar navigation={navigation}/>
        {forms.map((form) => (
            <TouchableOpacity key={form.id.toString()} onPress={() => handlePress(form)}>
                <FormCard form={form} />
            </TouchableOpacity>
        ))}
    </View>
  )
}
