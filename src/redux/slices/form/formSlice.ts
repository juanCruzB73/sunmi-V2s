// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IForm } from "../../../types/form/IForm";


export interface IFormState {
  isSavingForms:boolean;
  forms:IForm[]
  errorMessage: string | null;
  activeForm:IForm|null
}

const initialState: IFormState = {
  isSavingForms: false,
  forms: [],
  errorMessage: null,
  activeForm:null
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
    onSetActiveForm:(state,action: PayloadAction<IForm>)=>{
      state.activeForm=action.payload;
    },
    onSetErrorMessage:(state,action:PayloadAction<string|null>)=>{
        state.errorMessage=action.payload;
    }
  },
  
  
});

export const { onCheckingForms, onLoadForms, onSetErrorMessage,onSetActiveForm } = formSlice.actions;
export default formSlice.reducer;
