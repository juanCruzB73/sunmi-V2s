import { loginController } from "../../controllers/loginController";
import { AppDispatch } from "../store";
import { onChecking, onLogin, onLogOut } from "./authSlice";

export const startCheckingAuth=()=>{
    return async(dispatch:AppDispatch)=>{
        dispatch(onChecking())
    };
};

export const startLogIn = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const user = await loginController(email, password);
      console.log("user:", user);
      if (!user) {
        console.log("User not found");
        return;
      }
      dispatch(startCheckingAuth());
      dispatch(onLogin({
        userId: user.userId,
        name: user.name,
        email: user.email
      }));
    } catch (err) {
      console.error("Error in startLogIn:", err);
    }
  };
};


export const startLogOut=()=>{
    return async(dispatch:AppDispatch)=>{
        dispatch(startCheckingAuth());
        dispatch(onLogOut());
    }
};