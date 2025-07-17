import { AppDispatch } from '../../store';
import { onLoadForms, onSetErrorMessage } from './formSlice';
import NetInfo from '@react-native-community/netinfo';
import { IForm } from '../../../types/form/IForm';
import { getOfflineForms } from '../offline/formsOffline';

export const startOfflineForms=()=>{
    return async(dispatch: AppDispatch) =>{
        const netState = await NetInfo.fetch();

      if (!netState.isConnected) {
        const offlineForms = await getOfflineForms();

        console.log(offlineForms)

        const mappedForms: IForm[] = offlineForms.map(form => ({
          id: form.id,
          name: form.name,
          publish: form.publish,
          description: form.description,
          incident_id: form.incident_id,
          user_id: form.user_id,
          created_at: form.created_at,
          updated_at: form.updated_at,
          area_id: 0 as number,
          visible_app: true,
          question: []
        }));
        
        dispatch(onLoadForms(mappedForms));
        dispatch(onSetErrorMessage("Cargando formularios desde almacenamiento local"));
        return;
      }

    }
}