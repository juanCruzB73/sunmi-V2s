// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IQuestion } from "../../../types/form/IQuestion";


export interface IFormState {
  isSavingQuestions:boolean;
  questions:IQuestion[]
  errorMessage: string | null;
}

const initialState: IFormState = {
  isSavingQuestions: false,
  questions: [],
  errorMessage: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
  
    onCheckingQuestions: (state) => {
      state.isSavingQuestions=true;
    },
    onLoadQuestions: (state, action: PayloadAction<IQuestion[]>) => {
        state.questions=action.payload;
        state.isSavingQuestions=false;
    },
    onSetErrorMessage:(state,action:PayloadAction<string|null>)=>{
        state.errorMessage=action.payload;
    }
  },
  
  
});

export const { onCheckingQuestions, onLoadQuestions, onSetErrorMessage } = questionSlice.actions;
export default questionSlice.reducer;
