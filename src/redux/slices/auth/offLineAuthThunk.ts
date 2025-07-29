import { getDBConnection } from "../../../localDB/db";
import { loginOffline } from "../../../localDB/session/offlineAuth";
import { AppDispatch } from "../../store"
import { onLogin } from "./authSlice";
import { ILogin } from "./authThunk"

export const startOffLineLogin=(payload: ILogin)=>{
    return async (dispatch: AppDispatch) =>{
        const db = await getDBConnection();
        const offlineValid = await loginOffline(db, payload.email, payload.password);
        if(offlineValid){
            dispatch(onLogin({
                userId: offlineValid.userId,
                name: offlineValid.name,
                email: offlineValid.email,
            }));
        }
    }
}