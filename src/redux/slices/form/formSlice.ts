// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IForm } from "../../../types/form/IForm";


export interface IFormState {
  isSavingForms:boolean;
  forms:IForm[]
  errorMessage: string | null;
}

const initialState: IFormState = {
  isSavingForms: false,
  forms: [],
  errorMessage: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
  
    onCheckingForms: (state) => {
      state.isSavingForms=true;
    },
    onLoadForms: (state, action: PayloadAction<IForm[]>) => {
        state.forms=action.payload;
        state.isSavingForms=false;
    },
    onSetErrorMessage:(state,action:PayloadAction<string|null>)=>{
        state.errorMessage=action.payload;
    }
  },
  
  
});

export const { onCheckingForms, onLoadForms, onSetErrorMessage } = formSlice.actions;
export default formSlice.reducer;
