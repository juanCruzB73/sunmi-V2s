import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClaim } from "../../../types/claims/IClaim";

export interface IClaimState {
  isSavingClaims: boolean;
  isModified: boolean;
  claims: IClaim[];
  errorMessage: string | null;
  activeClaim: IClaim | null;
}

const initialState: IClaimState = {
  isSavingClaims: false,
  isModified: false,
  claims: [],
  errorMessage: null,
  activeClaim: null
};

const claimSlice = createSlice({
  name: "claim",
  initialState,
  reducers: {
    onCheckingClaims: (state) => {
      state.isSavingClaims = true;
    },
    onLoadClaims: (state, action: PayloadAction<IClaim[]>) => {
      state.claims = action.payload;
      state.isSavingClaims = false;
    },
    onAddClaim: (state, action: PayloadAction<IClaim>) => {
      state.claims.push(action.payload);
      state.isSavingClaims = false;
    },
    onEditClaim: (state, action: PayloadAction<IClaim>) => {
      state.claims = state.claims.map((claim) =>
        claim.id === action.payload.id ? action.payload : claim
      );
      state.isSavingClaims = false;
    },
    onDeleteClaim: (state, action: PayloadAction<number>) => {
      state.claims = state.claims.filter((claim) => claim.id !== action.payload);
      state.isSavingClaims = false;
    },
    onSetActiveClaim: (state, action: PayloadAction<IClaim | null>) => {
      state.activeClaim = action.payload;
      state.isSavingClaims = false;
    },
    onIsMofified: (state, action: PayloadAction<boolean>) => {
      state.isModified = action.payload;
    },
    onSetErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    }
  }
});

export const {
  onCheckingClaims,
  onLoadClaims,
  onAddClaim,
  onEditClaim,
  onDeleteClaim,
  onSetActiveClaim,
  onSetErrorMessage,
  onIsMofified
  
} = claimSlice.actions;

export default claimSlice.reducer;