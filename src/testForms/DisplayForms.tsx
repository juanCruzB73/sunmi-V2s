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

type Props = NativeStackScreenProps<RootStackParamList, 'DisplayForms'>;

export const DisplayForms = ({ navigation }: Props) => {
  const { forms,activeForm } = useSelector((state: RootState) => state.form);
  const { claims } = useSelector((state: RootState) => state.claim);
  //const { questions } = useSelector((state: RootState) => state.question);
  const dispatch = useDispatch<AppDispatch>();
  
  const handlePress = (form: IForm) => {
    dispatch(onSetActiveForm(form))
    navigation.navigate("ClaimMenu");
  };

    if (!Array.isArray(forms)) {
        return <Text style={{ padding: 20 }}>Loading Forms...</Text>;
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
