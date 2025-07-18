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
import { startLoadQuestions, startLoadQuestionsByPanel } from '../redux/slices/question/questionThunk';

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayForms'>;

export const DisplayForms = ({ navigation }: Props) => {
    const { forms } = useSelector((state: RootState) => state.form);
    //const { questions } = useSelector((state: RootState) => state.question);
    
    const dispatch = useDispatch<AppDispatch>();
    console.log(forms);

    const handlePress = (form: IForm) => {
        const getQuestions=async()=>{
            dispatch(startLoadQuestions(form.id));
        };
        dispatch(onSetActiveForm(form))
        getQuestions();
        navigation.navigate('DisplayQuestions')
    };

    if (!Array.isArray(forms)) {
        return <Text style={{ padding: 20 }}>Loading questions...</Text>;
    };

    return (
    <View>
        <TopBar navigation={navigation}/>
        {forms.map((form:IForm)=>(
            <>
                <TouchableOpacity key={form.id.toString()} activeOpacity={0.7} onPress={() => handlePress(form)}><FormCard key={form.id.toString()} form={form}/></TouchableOpacity>
                
            </>
        ))}
    </View>
  )
}
