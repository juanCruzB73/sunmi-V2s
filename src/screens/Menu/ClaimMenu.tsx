import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TopBar } from '../../components/top-bar/TopBar';
import CommerceButton from '../../components/commerce/CommerceButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../router/StackNavigator';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { IQuestion } from '../../types/form/IQuestion';
import { startLoadQuestions } from '../../redux/slices/question/questionThunk';
import { onLoadQuestions } from '../../redux/slices/question/questionSlice';
import { startGetClaims } from '../../redux/slices/claims/claimThunk';

type Props = NativeStackScreenProps<RootStackParamList, 'ClaimMenu'>;

const ClaimMenu = ({ navigation }: Props) => {

  const { activeForm } = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch<AppDispatch>();
    
  const getQuestions = async () => {

    let loadedQuestions: IQuestion[] = [];
    const result = await dispatch(startLoadQuestions(activeForm!.id));
      
    if ('payload' in result! && Array.isArray(result.payload)) {
      loadedQuestions = result.payload;
    };
  
    const filtered = loadedQuestions.filter(
      (q) => Array.isArray(q.question_options) && q.question_options.length > 0
    );
  
    dispatch(onLoadQuestions(filtered));
  };

  const getClaims=async()=>{
    dispatch(startGetClaims(activeForm!.id));
  };

      

  useEffect(()=>{
    getClaims()
    getQuestions();
  },[])


  return (
    <>
      <TopBar navigation={navigation} />
      <LinearGradient colors={['#f2f6fc', '#dde9f7']} style={styles.gradient}>
        <View style={styles.container}>
          <CommerceButton label={`Generar ${activeForm?.name}`} onPress={()=>{getQuestions();navigation.navigate('DisplayQuestions')}} />
          <CommerceButton label={`Listar  ${activeForm?.name}`} onPress={()=>navigation.navigate('ClaimSearcher')} />
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
    alignItems: 'stretch',
    paddingBottom: 60,
  },
});

export default ClaimMenu;