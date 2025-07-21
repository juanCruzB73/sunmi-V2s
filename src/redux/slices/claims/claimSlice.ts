import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClaim } from "../../../types/claims/IClaim";


export interface IFormState {
  isSavingClaims:boolean;
  claims:IClaim[]
  errorMessage: string | null;
  activeClaim:IClaim|null
}

const initialState: IFormState = {
  isSavingClaims: false,
  claims: [],
  errorMessage: null,
  activeClaim:null
};

const claimSlice = createSlice({
  name: "claim",
  initialState,
  reducers: {
    onCheckingClaims: (state) => {
      state.isSavingClaims=true;
    },
    onLoadClaims: (state, action: PayloadAction<IClaim[]>) => {
        state.claims=action.payload;
        state.isSavingClaims=false;
    },
    onSetActiveClaim:(state,action: PayloadAction<IClaim>)=>{
      state.activeClaim=action.payload;
    },
    onSetErrorMessage:(state,action:PayloadAction<string|null>)=>{
        state.errorMessage=action.payload;
    }
  }, 
});

export const { onCheckingClaims, onLoadClaims, onSetErrorMessage,onSetActiveClaim } = claimSlice.actions;
export default claimSlice.reducer;
