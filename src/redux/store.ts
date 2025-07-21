import { configureStore } from '@reduxjs/toolkit';
import  authSlice  from './slices/auth/authSlice';
import  formSlice  from './slices/form/formSlice';
import questionSlice from './slices/question/questionSlice';
import claimSlice from './slices/claims/claimSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    form: formSlice,
    question: questionSlice,
    claim:claimSlice,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
