import {API_BASE_URL } from '@env';
import { AppDispatch } from '../../store';
import { IAuthToken } from '../../../types/IAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCheckingForms, onLoadForms, onSetErrorMessage } from './formSlice';

const setTokenHeader=(tokenData:IAuthToken)=>{
   const headers={
    "access-token": tokenData.accessToken ?? "",
    "client": tokenData.client ?? "",
    "uid": tokenData.uid ?? "",
    "token-type": "Bearer",
    "Accept": "*/*"
    };
    return headers;
};

export const startLoadForms=()=>{
    return async (dispatch: AppDispatch) =>{
        try{
            dispatch(onCheckingForms());
            const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
            const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
            const tokenData:IAuthToken={accessToken: tokenObject['access-token'] ?? '',client: tokenObject['client'] ?? '',uid: tokenObject['uid'] ?? '',}
            const headers=setTokenHeader(tokenData);
            const response=await fetch(`${API_BASE_URL}/api/v1/forms/visible`,{headers:headers});
            const data=await response.json();
            console.log(data)
            dispatch(onLoadForms(data));
            dispatch(onSetErrorMessage(null));
        }catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(message);
            return false;
        }
    }
}