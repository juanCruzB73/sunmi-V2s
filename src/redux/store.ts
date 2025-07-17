import { configureStore } from '@reduxjs/toolkit';
import  authSlice  from './slices/auth/authSlice';
import  formSlice  from './slices/form/formSlice';
import questionSlice from './slices/question/questionSlice'
export const store = configureStore({
  reducer: {
    auth: authSlice,
    form: formSlice,
    question: questionSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
