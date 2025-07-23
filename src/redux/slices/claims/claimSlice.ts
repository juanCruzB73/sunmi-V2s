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
    onAddClaim:(state,action:PayloadAction<IClaim>)=>{
      state.claims.push(action.payload);
      state.isSavingClaims=false;
    },
    onEditClaim:(state,action:PayloadAction<IClaim>)=>{
      state.claims=state.claims.map((claim:IClaim)=>{
          if(claim.id === action.payload.id){
            return action.payload;
          }
          return claim;
      });
      state.isSavingClaims=false;
    },
    onDeleteClaim:(state,action:PayloadAction<number>)=>{
      state.claims=state.claims.filter(claim=>action.payload!==claim.id);
      state.isSavingClaims=false;
    },
    onSetActiveClaim:(state,action: PayloadAction<IClaim|null>)=>{
      state.activeClaim=action.payload;
      state.isSavingClaims=false;
    },
    onSetErrorMessage:(state,action:PayloadAction<string|null>)=>{
        state.errorMessage=action.payload;
    }
  }, 
});

export const { onCheckingClaims, onLoadClaims, onSetErrorMessage,onSetActiveClaim,onAddClaim,onEditClaim,onDeleteClaim } = claimSlice.actions;
export default claimSlice.reducer;
