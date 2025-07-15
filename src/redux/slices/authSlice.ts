// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  userId: number | null;
  name: string;
  email: string;
}



export interface IAuthState {
  status: "authenticated" | "non-authenticated" | "checking";
  user: IUser;
  errorMessage: string | null;
}

const initialState: IAuthState = {
  status: "non-authenticated",
  user: {
    name: "",
    email: "",
    userId: null,
  },
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  
    onCheckingAuth: (state) => {
      state.status = "checking";
      state.user = { name: "", email: "", userId: null };
      state.errorMessage = null;
    },
    onLogin: (state, action: PayloadAction<IUser>) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.errorMessage = null;
    },
    onLogOut: (state) => {
      state.status = "non-authenticated";
      state.user = { name: "", email: "", userId: null };
      state.errorMessage = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.accessToken = action.payload;
      }
    },
  },
  
  
});

export const { onCheckingAuth, onLogOut, onLogin, setToken } = authSlice.actions;
export default authSlice.reducer;
