/*import { loginController } from "../../controllers/loginController";
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
};*/
// src/redux/thunks/authThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/authService";
import { LoginPayload } from "../../types/authentication/auth";

export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const result = await AuthService.login({ email, password });

      return {
        name: result.data.name,
        email: result.data.email,
        userId: result.data.id,
        accessToken: result.headers.accessToken,
        client: result.headers.client,
        uid: result.headers.uid,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);