import { API_BASE_URL } from '@env';
import { AppDispatch } from '../../store';
import { IAuthToken } from '../../../types/IAuthToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onCheckingForms, onLoadForms, onSetErrorMessage } from './formSlice';
import NetInfo from '@react-native-community/netinfo';
import { IForm } from '../../../types/form/IForm';
import { getOfflineForms, saveFormOffline } from '../offline/formsOffline';

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

export const startLoadForms = () => {
  return async (dispatch: AppDispatch) => {
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

      const response = await fetch(`${API_BASE_URL}/api/v1/forms/visible`, { headers: headers });
      const data = await response.json();
      
      dispatch(onLoadForms(data))
      dispatch(onSetErrorMessage(null));

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      dispatch(onSetErrorMessage("Error al cargar formularios"));
      return false;
    }
  };
};

export const startCreateForm = (newForm: IForm) => {
  return async (dispatch: AppDispatch) => {
    try {
      const netState = await NetInfo.fetch();

      if (!netState.isConnected) {
        await saveFormOffline(newForm);
        dispatch(onSetErrorMessage("Formulario guardado localmente sin conexión"));
        return;
      }

      const values = await AsyncStorage.multiGet(['access-token', 'client', 'uid']);
      const tokenObject: { [key: string]: string | null } = Object.fromEntries(values);
      const tokenData: IAuthToken = {
        accessToken: tokenObject['access-token'] ?? '',
        client: tokenObject['client'] ?? '',
        uid: tokenObject['uid'] ?? '',
      };
      const headers = setTokenHeader(tokenData);

      const response = await fetch(`${API_BASE_URL}/api/v1/forms`, {
        method: 'POST',
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newForm)
      });

      const createdForm = await response.json();
      await saveFormOffline(createdForm); // ✅ Ajuste: guardar también si fue creado online
      dispatch(onSetErrorMessage(null));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(message);
      dispatch(onSetErrorMessage("Error al crear formulario"));
    }
  };
};