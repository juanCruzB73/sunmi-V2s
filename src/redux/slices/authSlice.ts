// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk } from "./authThunk";

export interface IUser {
  userId: number | null;
  name: string;
  email: string;
  accessToken?: string;
  client?: string;
  uid?: string;
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
  
    onChecking: (state) => {
      state.status = "checking";
      state.user = { name: "", email: "", userId: null };
      state.errorMessage = null;
    },
    loginSuccess: (state, action: PayloadAction<IUser>) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.errorMessage = null;
    },
    onLogOut: (state) => {
      state.status = "non-authenticated";
      state.user = { name: "", email: "", userId: null };
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = "authenticated";
        state.user = action.payload;
        state.errorMessage = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "non-authenticated";
        state.user = { name: "", email: "", userId: null };
        state.errorMessage = action.payload as string;
      });
  },
  
});

export const { onChecking, onLogOut, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
