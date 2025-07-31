import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClaim } from "../../../types/claims/IClaim";
import { unSyncedClaim } from "../../../types/unSyncedClaim";

export type ClaimType = IClaim | unSyncedClaim;

export interface IFormState {
  isSavingClaims:boolean;
  claims:ClaimType[]
  errorMessage: string | null;
  activeClaim:ClaimType|null
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
      state.isSavingClaims = true;
    },
    onLoadClaims: (state, action: PayloadAction<ClaimType[]>) => {
      state.claims = action.payload;
      state.isSavingClaims = false;
    },
    onAddClaim: (state, action: PayloadAction<ClaimType>) => {
      state.claims.push(action.payload);
      state.isSavingClaims = false;
    },
    onEditClaim: (state, action: PayloadAction<ClaimType>) => {
      state.claims = state.claims.map((claim) =>
        claim.id === action.payload.id ? action.payload : claim
      );
      state.isSavingClaims = false;
    },
    onDeleteClaim: (state, action: PayloadAction<number>) => {
      state.claims = state.claims.filter((claim) => claim.id !== action.payload);
      state.isSavingClaims = false;
    },
    onSetActiveClaim: (state, action: PayloadAction<ClaimType | null>) => {
      state.activeClaim = action.payload;
      state.isSavingClaims = false;
    },
    onSetErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
  },
});

export const { onCheckingClaims, onLoadClaims, onSetErrorMessage,onSetActiveClaim,onAddClaim,onEditClaim,onDeleteClaim } = claimSlice.actions;
export default claimSlice.reducer;