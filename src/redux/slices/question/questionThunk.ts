import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthToken } from "../../../types/IAuthToken";
import { AppDispatch } from "../../store";
import { onCheckingForms, onSetErrorMessage } from "../form/formSlice";
import { API_BASE_URL5 } from '@env';
import NetInfo from '@react-native-community/netinfo';
import { startOfflineQuestionsByPanel } from "../offline/questionsOffline";
import { startOfflineQuestions } from "./offlineQuestionThunk";

const setTokenHeader = (tokenData: IAuthToken) => {
  const headers = {
    "access-token": tokenData.accessToken ?? "",
    "client": tokenData.client ?? "",
    "uid": tokenData.uid ?? "",
    "token-type": "Bearer",
    "Accept": "*/*"
  };
  return headers;
};


export const startLoadQuestions=(formId:number)=>{
    return async (dispatch: AppDispatch) =>{
      const netState = await NetInfo.fetch();
      if (netState.isConnected){
        try{
            dispatch(onCheckingForms());
            const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
            const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
            const tokenData:IAuthToken={accessToken: tokenObject['access-token'] ?? '',client: tokenObject['client'] ?? '',uid: tokenObject['uid'] ?? '',}
            const headers=setTokenHeader(tokenData);
            
            const response=await fetch(`${API_BASE_URL5}/api/v1/forms/${formId}`,{headers:headers});

            if (response.ok) {
              const data=await response.json();
            };
            
            //dispatch(onLoadQuestions(data.questions));
            const data=await dispatch(startOfflineQuestions(formId));
            dispatch(onSetErrorMessage(null));
            return data ;

        }catch (error: unknown) {
            console.log('Error loading questions:', JSON.stringify(error, null, 2));
            return;
        }
      }else{
        const data=dispatch(startOfflineQuestions(formId));
        dispatch(onSetErrorMessage(null));
        return data ;
      }
    }
};

export const startLoadQuestionsByPanel = (formId: number, panelId: number) => {
  return async (dispatch: AppDispatch) => {
    const netState = await NetInfo.fetch();
    if (netState.isConnected){
      try {
        dispatch(onCheckingForms());

        const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
        const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
        const tokenData: IAuthToken = {
          accessToken: tokenObject['access-token'] ?? '',
          client: tokenObject['client'] ?? '',
          uid: tokenObject['uid'] ?? '',
        };
        const headers = setTokenHeader(tokenData);
        const response = await fetch(`${API_BASE_URL5}/api/v1/forms/${formId}/panels/${panelId}`, { headers });

        if (response.ok) {
          const data = await response.json();
        };

        //dispatch(onLoadQuestions(data.questions));
        const data=dispatch(startOfflineQuestionsByPanel(panelId));
        dispatch(onSetErrorMessage(null));
        return data;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log('Error loading questions:', JSON.stringify(error, null, 2));

        dispatch(onSetErrorMessage("Error al cargar preguntas por panel"));
      }
    }else{
      const data=dispatch(startOfflineQuestionsByPanel(panelId));
      dispatch(onSetErrorMessage(null));
      return data;
    }
  };
};